import {
  type Agent,
  AGENT_GLOBAL,
  AGENT_PROTOCOL_VERSION,
  type AgentCommand,
  type AgentResult,
  type InteractorReference,
  type Registry,
  type WireMatcher,
  type WireRegExp,
  type WireValue,
} from "./types.ts";

type InteractorConstructor = (...args: unknown[]) => InteractorImplementation;
type MatcherConstructor = (...args: unknown[]) => unknown;

interface InteractorImplementation {
  find(child: InteractorImplementation): InteractorImplementation;
  [key: string]: unknown;
}

export interface AgentDefinitions {
  readonly registry: Registry;
  readonly interactors: ReadonlyMap<string, InteractorConstructor>;
  readonly matchers: ReadonlyMap<string, MatcherConstructor>;
}

export function installAgent(definitions: AgentDefinitions): Agent {
  let { registry } = definitions;
  let availableMethods = new Map(
    registry.interactors.map((interactor) => [
      interactor.id,
      new Set([
        "exists",
        "absent",
        "has",
        "is",
        ...interactor.actions,
      ]),
    ]),
  );

  let agent: Agent = Object.freeze({
    protocolVersion: AGENT_PROTOCOL_VERSION,
    registryHash: registry.registryHash,

    async run(command: AgentCommand): Promise<AgentResult> {
      try {
        validateCommand(command, registry);

        let [first, ...rest] = command.path;
        let interactor = instantiate(first, definitions);

        for (let reference of rest) {
          interactor = interactor.find(instantiate(reference, definitions));
        }

        let leaf = command.path[command.path.length - 1];
        if (!availableMethods.get(leaf.interactor)?.has(command.method)) {
          throw namedError(
            "NoSuchMethodError",
            `Interactor ${JSON.stringify(leaf.interactor)} has no method ${
              JSON.stringify(command.method)
            }`,
          );
        }

        let method = interactor[command.method];
        if (typeof method !== "function") {
          throw namedError(
            "NoSuchMethodError",
            `Interactor ${
              JSON.stringify(leaf.interactor)
            } has no callable method ${JSON.stringify(command.method)}`,
          );
        }

        let value = await method.apply(
          interactor,
          (command.args ?? []).map((arg) => decodeValue(arg, definitions)),
        );

        return value === undefined ? { ok: true } : { ok: true, value };
      } catch (error) {
        return { ok: false, error: normalizeError(error) };
      }
    },
  });

  Object.defineProperty(globalThis, AGENT_GLOBAL, {
    configurable: true,
    enumerable: false,
    writable: false,
    value: agent,
  });

  return agent;
}

function validateCommand(command: AgentCommand, registry: Registry): void {
  if (command.protocolVersion !== AGENT_PROTOCOL_VERSION) {
    throw namedError(
      "ProtocolMismatchError",
      `Expected protocol ${AGENT_PROTOCOL_VERSION}, received ${command.protocolVersion}`,
    );
  }

  if (command.registryHash !== registry.registryHash) {
    throw namedError(
      "RegistryMismatchError",
      `Expected registry ${registry.registryHash}, received ${command.registryHash}`,
    );
  }

  if (!Array.isArray(command.path) || command.path.length === 0) {
    throw namedError(
      "InvalidCommandError",
      "An interaction path cannot be empty",
    );
  }

  if (typeof command.method !== "string" || command.method.length === 0) {
    throw namedError(
      "InvalidCommandError",
      "An interaction method is required",
    );
  }
}

function instantiate(
  reference: InteractorReference,
  definitions: AgentDefinitions,
): InteractorImplementation {
  let constructor = definitions.interactors.get(reference.interactor);
  if (typeof constructor !== "function") {
    throw namedError(
      "NoSuchInteractorError",
      `No interactor is registered as ${JSON.stringify(reference.interactor)}`,
    );
  }

  let hasLocator = Object.prototype.hasOwnProperty.call(reference, "locator");
  let hasFilters = Object.prototype.hasOwnProperty.call(reference, "filters");
  let filters = hasFilters
    ? decodeValue(reference.filters as WireValue, definitions)
    : undefined;

  if (hasLocator) {
    return constructor(
      decodeValue(reference.locator as WireValue, definitions),
      filters,
    );
  } else if (hasFilters) {
    return constructor(filters);
  } else {
    return constructor();
  }
}

function decodeValue(value: WireValue, definitions: AgentDefinitions): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => decodeValue(item, definitions));
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  if (isWireRegExp(value)) {
    return new RegExp(value.source, value.flags ?? "");
  }

  if (isWireMatcher(value)) {
    let constructor = definitions.matchers.get(value.matcher);
    if (typeof constructor !== "function") {
      throw namedError(
        "NoSuchMatcherError",
        `No matcher is registered as ${JSON.stringify(value.matcher)}`,
      );
    }
    return constructor(
      ...value.args.map((arg) => decodeValue(arg, definitions)),
    );
  }

  let decoded: Record<string, unknown> = {};
  for (let [key, item] of Object.entries(value)) {
    Object.defineProperty(decoded, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: decodeValue(item, definitions),
    });
  }
  return decoded;
}

function isWireRegExp(value: object): value is WireRegExp {
  return "$type" in value && value.$type === "regexp" &&
    "source" in value && typeof value.source === "string" &&
    (!("flags" in value) || typeof value.flags === "string");
}

function isWireMatcher(value: object): value is WireMatcher {
  return "$type" in value && value.$type === "matcher" &&
    "matcher" in value && typeof value.matcher === "string" &&
    "args" in value && Array.isArray(value.args);
}

function namedError(name: string, message: string): Error {
  let error = new Error(message);
  error.name = name;
  return error;
}

function normalizeError(error: unknown): {
  name: string;
  message: string;
  stack?: string;
} {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      ...(error.stack ? { stack: error.stack } : {}),
    };
  }

  try {
    let serialized = JSON.stringify(error);
    return {
      name: "Error",
      message: typeof error === "string" ? error : serialized ?? String(error),
    };
  } catch {
    try {
      return { name: "Error", message: String(error) };
    } catch {
      return { name: "Error", message: "Unknown thrown value" };
    }
  }
}
