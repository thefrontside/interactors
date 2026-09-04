import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { JSDOM } from "jsdom";
import { compile } from "../src/compile.ts";
import {
  type Agent,
  AGENT_GLOBAL,
  AGENT_PROTOCOL_VERSION,
  type Registry,
} from "../src/types.ts";

describe("compile", () => {
  it("produces a closed, browser-loadable three-file artifact set", async () => {
    let fixture = new URL("./fixtures/basic/index.ts", import.meta.url);
    let temporary = await Deno.makeTempDir({
      dir: new URL(".", import.meta.url).pathname,
      prefix: ".compile-test-",
    });
    let entrypoint = `${temporary}/index.ts`;
    let outdir = `${temporary}/dist`;

    try {
      await Deno.copyFile(fixture, entrypoint);
      let result = await compile({ entrypoint, outdir });

      let files = [];
      for await (let entry of Deno.readDir(outdir)) {
        files.push(entry.name);
      }
      expect(files.sort()).toEqual([
        "agent.js",
        "interactors.d.ts",
        "interactors.json",
      ]);

      let registry = JSON.parse(
        await Deno.readTextFile(result.registryPath),
      ) as Registry;
      expect(registry.protocolVersion).toBe(AGENT_PROTOCOL_VERSION);
      expect(registry.registryHash).toMatch(/^sha256:[a-f0-9]{64}$/);
      expect(registry.interactors).toEqual([
        {
          id: "Button",
          name: "button",
          actions: ["click"],
          filters: ["disabled"],
        },
        {
          id: "Form",
          name: "form",
          actions: [],
          filters: [],
        },
        {
          id: "TextField",
          name: "text field",
          actions: ["fillIn"],
          filters: ["disabled", "value"],
        },
      ]);
      expect(registry.registryHash).toBe(await hashRegistry(registry));
      expect(registry.matchers.map(({ id }) => id)).toEqual([
        "and",
        "every",
        "including",
        "matching",
        "not",
        "or",
        "sameLength",
        "some",
      ]);

      let declarations = await Deno.readTextFile(result.declarationsPath);
      expect(declarations).toContain(`// Registry: ${registry.registryHash}`);
      expect(declarations).toContain("export declare const TextField");
      expect(declarations).toContain("value: string");
      expect(declarations).toContain('import("@interactors/core")');
      expect(declarations).not.toContain("index.ts");
      expect(declarations).not.toContain("file:");

      let agentSource = await Deno.readTextFile(result.agentPath);
      expect(agentSource).toContain(`// Registry: ${registry.registryHash}`);

      let repeated = await compile({
        entrypoint,
        outdir: `${temporary}/dist-repeated`,
      });
      expect(await Deno.readTextFile(repeated.agentPath)).toBe(agentSource);
      expect(await Deno.readTextFile(repeated.registryPath)).toBe(
        await Deno.readTextFile(result.registryPath),
      );
      expect(await Deno.readTextFile(repeated.declarationsPath)).toBe(
        declarations,
      );

      await Deno.remove(entrypoint);
      await expectDeclarationsToCheck(temporary, result.declarationsPath);

      let dom = new JSDOM(
        `
          <!doctype html>
          <html>
            <body>
              <label for="Email">Email</label>
              <form id="profile">
                <input id="Email" />
              </form>
            </body>
          </html>
        `,
        { runScripts: "outside-only" },
      );

      try {
        dom.window.eval(agentSource);
        let agent = Reflect.get(dom.window, AGENT_GLOBAL) as Agent;

        expect(agent.protocolVersion).toBe(AGENT_PROTOCOL_VERSION);
        expect(agent.registryHash).toBe(registry.registryHash);

        let fillResult = await agent.run({
          protocolVersion: AGENT_PROTOCOL_VERSION,
          registryHash: registry.registryHash,
          path: [{ interactor: "TextField", locator: "Email" }],
          method: "fillIn",
          args: ["jonas@example.com"],
        });
        expect(fillResult).toEqual({ ok: true });
        expect(dom.window.document.querySelector("input")?.value).toBe(
          "jonas@example.com",
        );

        let valueResult = await agent.run({
          protocolVersion: AGENT_PROTOCOL_VERSION,
          registryHash: registry.registryHash,
          path: [{
            interactor: "TextField",
            locator: {
              $type: "matcher",
              matcher: "matching",
              args: [{ $type: "regexp", source: "mail", flags: "i" }],
            },
          }],
          method: "value",
        });
        expect(valueResult).toEqual({ ok: true, value: "jonas@example.com" });

        let customMatcherResult = await agent.run({
          protocolVersion: AGENT_PROTOCOL_VERSION,
          registryHash: registry.registryHash,
          path: [{
            interactor: "TextField",
            locator: {
              $type: "matcher",
              matcher: "sameLength",
              args: ["Other"],
            },
          }],
          method: "value",
        });
        expect(customMatcherResult).toEqual({
          ok: true,
          value: "jonas@example.com",
        });

        let nestedResult = await agent.run({
          protocolVersion: AGENT_PROTOCOL_VERSION,
          registryHash: registry.registryHash,
          path: [
            { interactor: "Form", locator: "profile" },
            { interactor: "TextField", filters: { disabled: false } },
          ],
          method: "value",
        });
        expect(nestedResult).toEqual({
          ok: true,
          value: "jonas@example.com",
        });

        let unavailableMethod = await agent.run({
          protocolVersion: AGENT_PROTOCOL_VERSION,
          registryHash: registry.registryHash,
          path: [{ interactor: "TextField" }],
          method: "find",
        });
        expect(unavailableMethod.ok).toBe(false);
        if (!unavailableMethod.ok) {
          expect(unavailableMethod.error.name).toBe("NoSuchMethodError");
        }

        let wrongProtocol = await agent.run({
          protocolVersion: AGENT_PROTOCOL_VERSION + 1,
          registryHash: registry.registryHash,
          path: [{ interactor: "TextField" }],
          method: "exists",
        });
        expect(wrongProtocol.ok).toBe(false);
        if (!wrongProtocol.ok) {
          expect(wrongProtocol.error.name).toBe("ProtocolMismatchError");
        }

        let inheritedInteractor = await agent.run({
          protocolVersion: AGENT_PROTOCOL_VERSION,
          registryHash: registry.registryHash,
          path: [{ interactor: "constructor" }],
          method: "exists",
        });
        expect(inheritedInteractor.ok).toBe(false);
        if (!inheritedInteractor.ok) {
          expect(inheritedInteractor.error.name).toBe(
            "NoSuchInteractorError",
          );
        }

        let inheritedMatcher = await agent.run({
          protocolVersion: AGENT_PROTOCOL_VERSION,
          registryHash: registry.registryHash,
          path: [{
            interactor: "TextField",
            locator: {
              $type: "matcher",
              matcher: "constructor",
              args: [],
            },
          }],
          method: "exists",
        });
        expect(inheritedMatcher.ok).toBe(false);
        if (!inheritedMatcher.ok) {
          expect(inheritedMatcher.error.name).toBe("NoSuchMatcherError");
        }

        let mismatch = await agent.run({
          protocolVersion: AGENT_PROTOCOL_VERSION,
          registryHash: "sha256:wrong",
          path: [{ interactor: "TextField" }],
          method: "exists",
        });
        expect(mismatch.ok).toBe(false);
        if (!mismatch.ok) {
          expect(mismatch.error.name).toBe("RegistryMismatchError");
        }
      } finally {
        dom.window.close();
      }
    } finally {
      await Deno.remove(temporary, { recursive: true });
    }
  });

  it("preserves package types when the entrypoint re-exports interactors", async () => {
    let entrypoint =
      new URL("./fixtures/reexport.ts", import.meta.url).pathname;
    let outdir = await Deno.makeTempDir();

    try {
      let result = await compile({ entrypoint, outdir });
      let declarations = await Deno.readTextFile(result.declarationsPath);
      let registry = JSON.parse(
        await Deno.readTextFile(result.registryPath),
      ) as Registry;
      let agentSource = await Deno.readTextFile(result.agentPath);

      expect(declarations).toContain(
        'typeof import("@interactors/html")["Button"]',
      );
      expect(declarations).toContain(
        'typeof import("@interactors/html")["TextField"]',
      );
      expect(declarations).not.toContain("file:");

      let dom = new JSDOM(`<!doctype html><input id="Email" />`, {
        runScripts: "outside-only",
      });
      try {
        dom.window.eval(agentSource);
        let agent = Reflect.get(dom.window, AGENT_GLOBAL) as Agent;
        expect(agent.registryHash).toBe(registry.registryHash);
      } finally {
        dom.window.close();
      }
    } finally {
      await Deno.remove(outdir, { recursive: true });
    }
  });

  it("rejects an entrypoint without interactors before creating artifacts", async () => {
    let temporary = await Deno.makeTempDir({
      dir: new URL(".", import.meta.url).pathname,
      prefix: ".compile-empty-test-",
    });
    let entrypoint = `${temporary}/index.ts`;
    let outdir = `${temporary}/dist`;

    try {
      await Deno.writeTextFile(entrypoint, "export const ignored = 1;\n");
      await expect(compile({ entrypoint, outdir })).rejects.toThrow(
        "No interactor constructors were exported",
      );

      let outdirExists = true;
      try {
        await Deno.stat(outdir);
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          outdirExists = false;
        } else {
          throw error;
        }
      }
      expect(outdirExists).toBe(false);
    } finally {
      await Deno.remove(temporary, { recursive: true });
    }
  });

  it("rejects action and filter names that collide with the wire API", async () => {
    let temporary = await Deno.makeTempDir({
      dir: new URL(".", import.meta.url).pathname,
      prefix: ".compile-reserved-test-",
    });
    let entrypoint = `${temporary}/index.ts`;

    try {
      await Deno.writeTextFile(
        entrypoint,
        `import { createInteractor } from "@interactors/core";

export const Unsafe = createInteractor("unsafe")
  .selector("div")
  .actions({
    find: ({ perform }) => perform(() => undefined),
  });
`,
      );
      await expect(compile({ entrypoint, outdir: `${temporary}/dist` }))
        .rejects.toThrow(
          'Interactor "Unsafe" declares reserved method "find"',
        );
    } finally {
      await Deno.remove(temporary, { recursive: true });
    }
  });

  it("rejects browser bundles with unsupported external modules", async () => {
    let entrypoint = new URL(
      "./fixtures/unsupported-node.ts",
      import.meta.url,
    ).pathname;
    let outdir = await Deno.makeTempDir();

    try {
      await expect(compile({ entrypoint, outdir })).rejects.toThrow(
        'Browser agent depends on unsupported external module: "node:path"',
      );
      let files = [];
      for await (let entry of Deno.readDir(outdir)) {
        files.push(entry.name);
      }
      expect(files).toEqual([]);
    } finally {
      await Deno.remove(outdir, { recursive: true });
    }
  });
});

async function expectDeclarationsToCheck(
  directory: string,
  path: string,
): Promise<void> {
  let consumer = `${directory}/consumer.ts`;
  await Deno.writeTextFile(
    consumer,
    `import type * as Definitions from "./dist/interactors.d.ts";

declare const TextField: typeof Definitions.TextField;
declare const sameLength: typeof Definitions.sameLength;

TextField({ value: "ready", disabled: false }).fillIn("complete");
sameLength("ready");

// @ts-expect-error fillIn accepts a string
TextField().fillIn(42);

// @ts-expect-error value is a string filter
TextField({ value: 42 });

// @ts-expect-error sameLength accepts a string
sameLength(42);
`,
  );
  let output = await new Deno.Command(Deno.execPath(), {
    args: ["check", consumer, path],
    stdout: "piped",
    stderr: "piped",
  }).output();
  let error = new TextDecoder().decode(output.stderr);
  expect(output.success, error).toBe(true);
}

async function hashRegistry(registry: Registry): Promise<string> {
  let content = JSON.stringify({
    protocolVersion: registry.protocolVersion,
    interactors: registry.interactors,
    matchers: registry.matchers,
  });
  let digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(content),
  );
  let hex = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `sha256:${hex}`;
}
