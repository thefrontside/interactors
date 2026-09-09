import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createRemoteDefinitions } from "./client.ts";
import {
  AGENT_GLOBAL,
  AGENT_PROTOCOL_VERSION,
  type AgentCommand,
  type AgentResult,
  type Registry,
  type RegistryInteractor,
  type RegistryMatcher,
} from "./protocol.ts";
import type { RemoteDefinitions } from "./types.ts";

const reservedInteractorMethods = new Set([
  "absent",
  "apply",
  "assert",
  "description",
  "exists",
  "find",
  "has",
  "is",
  "options",
  "perform",
  "then",
]);

export interface PageLike {
  addInitScript(
    script: string | { readonly content: string },
  ): Promise<unknown>;
  evaluate<Result, Argument = void>(
    pageFunction:
      | string
      | ((argument: Argument) => Result | Promise<Result>),
    argument?: Argument,
  ): Promise<Awaited<Result>>;
}

export interface LoadInteractorsOptions {
  readonly page: PageLike;
  readonly directory: string | URL;
}

/** Load a compiled Interactor registry and connect it to a Playwright page. */
export async function loadInteractors<Definitions = Record<never, never>>(
  options: LoadInteractorsOptions,
): Promise<RemoteDefinitions<Definitions>> {
  let [registryText, agentSource] = await Promise.all([
    readArtifact(options.directory, "interactors.json"),
    readArtifact(options.directory, "agent.js"),
  ]);
  let registry = parseRegistry(registryText);

  let initScript = await options.page.addInitScript({
    content: mainFrameInitScript(agentSource),
  });
  try {
    await options.page.evaluate(agentSource);
    await verifyAgent(options.page, registry);
  } catch (error) {
    await disposeInitScript(initScript);
    throw error;
  }

  return createRemoteDefinitions<Definitions>(registry, {
    run: (command) => runCommand(options.page, command),
  });
}

function mainFrameInitScript(agentSource: string): string {
  return `if (globalThis.window === globalThis.top) {\n${agentSource}\n}\n`;
}

async function disposeInitScript(value: unknown): Promise<void> {
  if (!isRecord(value) || typeof value.dispose !== "function") {
    return;
  }
  try {
    await value.dispose.call(value);
  } catch {
    // Preserve the installation or handshake error that caused this cleanup.
  }
}

async function readArtifact(
  directory: string | URL,
  filename: string,
): Promise<string> {
  let path = directory instanceof URL
    ? new URL(
      filename,
      directory.href.endsWith("/") ? directory : `${directory.href}/`,
    )
    : join(directory, filename);
  return await readFile(path, "utf8");
}

async function verifyAgent(page: PageLike, registry: Registry): Promise<void> {
  let identity = await page.evaluate<
    { protocolVersion: unknown; registryHash: unknown; canRun: boolean } | null
  >(() => {
    let agent = Reflect.get(document.defaultView!, "__interactors__") as
      | { protocolVersion?: unknown; registryHash?: unknown; run?: unknown }
      | undefined;
    return agent
      ? {
        protocolVersion: agent.protocolVersion,
        registryHash: agent.registryHash,
        canRun: typeof agent.run === "function",
      }
      : null;
  });

  if (!identity) {
    throw new Error(
      `Interactor agent was not installed as globalThis.${AGENT_GLOBAL}`,
    );
  }
  if (!identity.canRun) {
    throw new Error(
      `Interactor agent globalThis.${AGENT_GLOBAL} does not expose run()`,
    );
  }
  if (identity.protocolVersion !== registry.protocolVersion) {
    throw new Error(
      `Interactor protocol mismatch: registry uses ${registry.protocolVersion}, agent uses ${
        String(identity.protocolVersion)
      }`,
    );
  }
  if (identity.registryHash !== registry.registryHash) {
    throw new Error(
      `Interactor registry mismatch: expected ${registry.registryHash}, agent uses ${
        String(identity.registryHash)
      }`,
    );
  }
}

async function runCommand(
  page: PageLike,
  command: AgentCommand,
): Promise<unknown> {
  return await page.evaluate<unknown, AgentCommand>(async (command) => {
    let agent = Reflect.get(document.defaultView!, "__interactors__") as
      | { run?: (command: AgentCommand) => Promise<AgentResult> }
      | undefined;
    if (!agent || typeof agent.run !== "function") {
      return {
        ok: false,
        error: {
          name: "AgentUnavailableError",
          message: "Interactor agent is not installed in the current page",
        },
      };
    }
    return await agent.run(command);
  }, command);
}

export function parseRegistry(source: string): Registry {
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch (error) {
    throw new Error(
      `Unable to parse interactors.json: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
  if (!isRecord(value)) {
    throw new Error("interactors.json must contain an object");
  }
  if (value.protocolVersion !== AGENT_PROTOCOL_VERSION) {
    throw new Error(
      `Unsupported Interactor protocol: ${String(value.protocolVersion)}`,
    );
  }
  if (
    typeof value.registryHash !== "string" ||
    !/^sha256:[a-f0-9]{64}$/.test(value.registryHash)
  ) {
    throw new Error("interactors.json has an invalid registryHash");
  }

  let interactors = parseInteractors(value.interactors);
  let matchers = parseMatchers(value.matchers);
  validateDefinitionNames(interactors, matchers);

  let content = JSON.stringify({
    protocolVersion: AGENT_PROTOCOL_VERSION,
    interactors,
    matchers,
  });
  let expectedHash = `sha256:${
    createHash("sha256").update(content).digest("hex")
  }`;
  if (value.registryHash !== expectedHash) {
    throw new Error(
      `interactors.json registryHash does not match its contents: expected ${expectedHash}`,
    );
  }

  return {
    protocolVersion: AGENT_PROTOCOL_VERSION,
    registryHash: value.registryHash,
    interactors,
    matchers,
  };
}

function parseInteractors(value: unknown): RegistryInteractor[] {
  if (!Array.isArray(value)) {
    throw new Error("interactors.json interactors must be an array");
  }
  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`Interactor registry entry ${index} must be an object`);
    }
    let id = requireString(item.id, `Interactor registry entry ${index} id`);
    let name = requireString(
      item.name,
      `Interactor registry entry ${JSON.stringify(id)} name`,
    );
    let actions = requireStringArray(
      item.actions,
      `Interactor registry entry ${JSON.stringify(id)} actions`,
    );
    let filters = requireStringArray(
      item.filters,
      `Interactor registry entry ${JSON.stringify(id)} filters`,
    );
    let methodNames = new Set(reservedInteractorMethods);
    for (let method of [...actions, ...filters]) {
      if (methodNames.has(method)) {
        throw new Error(
          `Interactor ${JSON.stringify(id)} has duplicate or reserved method ${
            JSON.stringify(method)
          }`,
        );
      }
      methodNames.add(method);
    }
    return { id, name, actions, filters };
  });
}

function parseMatchers(value: unknown): RegistryMatcher[] {
  if (!Array.isArray(value)) {
    throw new Error("interactors.json matchers must be an array");
  }
  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`Matcher registry entry ${index} must be an object`);
    }
    let id = requireString(item.id, `Matcher registry entry ${index} id`);
    let name = requireString(
      item.name,
      `Matcher registry entry ${JSON.stringify(id)} name`,
    );
    return { id, name };
  });
}

function validateDefinitionNames(
  interactors: readonly RegistryInteractor[],
  matchers: readonly RegistryMatcher[],
): void {
  let names = new Set<string>();
  for (let definition of [...interactors, ...matchers]) {
    if (definition.id === "then") {
      throw new Error('Registry cannot expose a definition named "then"');
    }
    if (names.has(definition.id)) {
      throw new Error(
        `Registry definition ${JSON.stringify(definition.id)} is duplicated`,
      );
    }
    names.add(definition.id);
  }

  let matcherNames = new Set(matchers.map(({ id }) => id));
  for (
    let builtin of [
      "and",
      "every",
      "including",
      "matching",
      "not",
      "or",
      "some",
    ]
  ) {
    if (!matcherNames.has(builtin)) {
      throw new Error(
        `Registry is missing built-in matcher ${JSON.stringify(builtin)}`,
      );
    }
  }
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value;
}

function requireStringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array`);
  }
  return value.map((item, index) => requireString(item, `${label}[${index}]`));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
