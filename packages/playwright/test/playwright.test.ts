import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { pathToFileURL } from "node:url";
import { loadInteractors, type PageLike } from "../src/playwright.ts";
import type { AgentCommand, AgentResult } from "../src/protocol.ts";
import type * as Definitions from "./fixtures/index.ts";
import { createTestRegistry } from "./helpers.ts";

describe("Playwright loader", () => {
  it("installs the agent now and for future navigations", async () => {
    let registry = createTestRegistry();
    let page = new FakePage({
      protocolVersion: registry.protocolVersion,
      registryHash: registry.registryHash,
      canRun: true,
    });

    await withArtifacts(registry, async (directory, agentSource) => {
      let ui = await loadInteractors<typeof Definitions>({
        page,
        directory: pathToFileURL(directory),
      });
      await ui.TextField("Email").fillIn("ready");

      expect(page.initScripts).toHaveLength(1);
      expect(page.initScripts[0]).toContain(
        "globalThis.window === globalThis.top",
      );
      expect(page.initScripts[0]).toContain(agentSource);
      expect(page.evaluatedScripts).toEqual([agentSource]);
      expect(page.commands).toHaveLength(1);
      expect(page.commands[0].registryHash).toBe(registry.registryHash);
      expect(page.commands[0].method).toBe("fillIn");
    });
  });

  it("rejects a mismatched registry and browser agent", async () => {
    let registry = createTestRegistry();
    let page = new FakePage({
      protocolVersion: registry.protocolVersion,
      registryHash: "sha256:agent-from-another-build",
      canRun: true,
    });

    await withArtifacts(registry, async (directory) => {
      await expect(loadInteractors({ page, directory })).rejects.toThrow(
        "Interactor registry mismatch",
      );
      expect(page.disposedInitScripts).toBe(1);
    });
  });

  it("validates the registry hash before touching the page", async () => {
    let registry = {
      ...createTestRegistry(),
      registryHash: `sha256:${"0".repeat(64)}`,
    };
    let page = new FakePage(null);

    await withArtifacts(registry, async (directory) => {
      await expect(loadInteractors({ page, directory })).rejects.toThrow(
        "registryHash does not match its contents",
      );
      expect(page.initScripts).toEqual([]);
      expect(page.evaluatedScripts).toEqual([]);
    });
  });

  it("rejects an installed global without an agent runner", async () => {
    let registry = createTestRegistry();
    let page = new FakePage({
      protocolVersion: registry.protocolVersion,
      registryHash: registry.registryHash,
      canRun: false,
    });

    await withArtifacts(registry, async (directory) => {
      await expect(loadInteractors({ page, directory })).rejects.toThrow(
        "does not expose run()",
      );
      expect(page.disposedInitScripts).toBe(1);
    });
  });

  it("requires every matcher installed by the compiled agent", async () => {
    let registry = createTestRegistry({
      matchers: createTestRegistry().matchers.filter(({ id }) => id !== "or"),
    });
    let page = new FakePage(null);

    await withArtifacts(registry, async (directory) => {
      await expect(loadInteractors({ page, directory })).rejects.toThrow(
        'Registry is missing built-in matcher "or"',
      );
      expect(page.initScripts).toEqual([]);
      expect(page.evaluatedScripts).toEqual([]);
    });
  });

  it("rejects compiler-reserved methods before touching the page", async () => {
    let [textField] = createTestRegistry().interactors.filter(({ id }) =>
      id === "TextField"
    );
    let registry = createTestRegistry({
      interactors: [{ ...textField, actions: ["perform"] }],
    });
    let page = new FakePage(null);

    await withArtifacts(registry, async (directory) => {
      await expect(loadInteractors({ page, directory })).rejects.toThrow(
        'Interactor "TextField" has duplicate or reserved method "perform"',
      );
      expect(page.initScripts).toEqual([]);
      expect(page.evaluatedScripts).toEqual([]);
    });
  });
});

class FakePage implements PageLike {
  readonly initScripts: string[] = [];
  readonly evaluatedScripts: string[] = [];
  readonly commands: AgentCommand[] = [];
  disposedInitScripts = 0;

  constructor(
    private readonly identity: {
      readonly protocolVersion: unknown;
      readonly registryHash: unknown;
      readonly canRun: boolean;
    } | null,
    private readonly result: AgentResult = { ok: true },
  ) {}

  addInitScript(
    script: string | { readonly content: string },
  ): Promise<{ dispose: () => Promise<void> }> {
    this.initScripts.push(typeof script === "string" ? script : script.content);
    return Promise.resolve({
      dispose: () => {
        this.disposedInitScripts++;
        return Promise.resolve();
      },
    });
  }

  evaluate<Result, Argument = void>(
    pageFunction:
      | string
      | ((argument: Argument) => Result | Promise<Result>),
    argument?: Argument,
  ): Promise<Awaited<Result>> {
    if (typeof pageFunction === "string") {
      this.evaluatedScripts.push(pageFunction);
      return Promise.resolve(undefined as Awaited<Result>);
    }
    if (argument !== undefined) {
      this.commands.push(argument as AgentCommand);
      return Promise.resolve(this.result as Awaited<Result>);
    }
    return Promise.resolve(this.identity as Awaited<Result>);
  }
}

async function withArtifacts(
  registry: object,
  callback: (directory: string, agentSource: string) => Promise<void>,
): Promise<void> {
  let directory = await Deno.makeTempDir();
  let agentSource = "globalThis.__interactors__ = {};\n";
  try {
    await Promise.all([
      Deno.writeTextFile(
        `${directory}/interactors.json`,
        `${JSON.stringify(registry, null, 2)}\n`,
      ),
      Deno.writeTextFile(`${directory}/agent.js`, agentSource),
    ]);
    await callback(directory, agentSource);
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
}
