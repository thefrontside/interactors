import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { createRemoteDefinitions } from "../src/client.ts";
import type { AgentCommand } from "../src/protocol.ts";
import type * as Definitions from "./fixtures/index.ts";
import { createTestRegistry } from "./helpers.ts";

describe("remote Interactor client", () => {
  it("turns actions into versioned agent commands", async () => {
    let commands: AgentCommand[] = [];
    let ui = createRemoteDefinitions<typeof Definitions>(
      createTestRegistry(),
      transport(commands),
    );

    await ui.TextField("Email", { disabled: false }).fillIn(
      "jonas@example.com",
    );

    expect(commands).toEqual([{
      protocolVersion: 1,
      registryHash: createTestRegistry().registryHash,
      path: [{
        interactor: "TextField",
        locator: "Email",
        filters: { disabled: false },
      }],
      method: "fillIn",
      args: ["jonas@example.com"],
    }]);
  });

  it("encodes nested paths, regular expressions, and matchers", async () => {
    let commands: AgentCommand[] = [];
    let ui = createRemoteDefinitions<typeof Definitions>(
      createTestRegistry(),
      transport(commands),
    );

    await ui.Form("profile").find(
      ui.TextField({
        value: ui.not(ui.matching(/ready/iu)),
      }),
    ).has({ value: "ready" });

    expect(commands).toEqual([{
      protocolVersion: 1,
      registryHash: createTestRegistry().registryHash,
      path: [
        { interactor: "Form", locator: "profile" },
        {
          interactor: "TextField",
          filters: {
            value: {
              $type: "matcher",
              matcher: "not",
              args: [{
                $type: "matcher",
                matcher: "matching",
                args: [{
                  $type: "regexp",
                  source: "ready",
                  flags: "iu",
                }],
              }],
            },
          },
        },
      ],
      method: "has",
      args: [{ value: "ready" }],
    }]);
  });

  it("does not expose filter getters", () => {
    let ui = createRemoteDefinitions<typeof Definitions>(
      createTestRegistry(),
      transport([]),
    );

    expect(Reflect.has(ui.TextField(), "value")).toBe(false);
    expect(Reflect.has(ui.TextField(), "disabled")).toBe(false);
  });

  it("encodes filters, custom matchers, arrays, and assertions", async () => {
    let commands: AgentCommand[] = [];
    let ui = createRemoteDefinitions<typeof Definitions>(
      createTestRegistry(),
      transport(commands),
    );

    await ui.MultiSelect({
      values: ui.some(ui.sameLength("Neon")),
    }).has({ values: ["Neon", "Argon"] });

    expect(commands[0].path[0]).toEqual({
      interactor: "MultiSelect",
      filters: {
        values: {
          $type: "matcher",
          matcher: "some",
          args: [{
            $type: "matcher",
            matcher: "sameLength",
            args: ["Neon"],
          }],
        },
      },
    });
    expect(commands[0].method).toBe("has");
    expect(commands[0].args).toEqual([{ values: ["Neon", "Argon"] }]);
  });

  it("reconstructs remote errors with their browser stack", async () => {
    let ui = createRemoteDefinitions<typeof Definitions>(
      createTestRegistry(),
      transport([], {
        ok: false,
        error: {
          name: "NoSuchElementError",
          message: "text field Email was not found",
          stack: "NoSuchElementError: browser frame",
        },
      }),
    );

    let caught: unknown;
    try {
      await ui.TextField("Email").exists();
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).name).toBe("NoSuchElementError");
    expect((caught as Error).message).toBe("text field Email was not found");
    expect((caught as Error).stack).toContain("Remote browser stack");
    expect((caught as Error).stack).toContain(
      "NoSuchElementError: browser frame",
    );
  });

  it("rejects malformed results from the page boundary", async () => {
    let malformed = createRemoteDefinitions<typeof Definitions>(
      createTestRegistry(),
      transport([], null),
    );
    await expect(malformed.TextField().exists()).rejects.toThrow(
      "Interactor agent returned an invalid result",
    );

    let malformedError = createRemoteDefinitions<typeof Definitions>(
      createTestRegistry(),
      transport([], { ok: false, error: { name: 42, message: "broken" } }),
    );
    await expect(malformedError.TextField().exists()).rejects.toThrow(
      "Interactor agent returned an invalid error result",
    );
  });

  it("rejects values and proxies that cannot cross this client boundary", async () => {
    let first = createRemoteDefinitions<typeof Definitions>(
      createTestRegistry(),
      transport([]),
    );
    let second = createRemoteDefinitions<typeof Definitions>(
      createTestRegistry(),
      transport([]),
    );

    expect(() => first.Form().find(second.TextField())).toThrow(
      "same loaded registry",
    );
    expect(() => first.TextField(second.matching(/Email/))).toThrow(
      "different loaded registry",
    );

    let cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    await expect(
      first.TextField().has(cyclic as never),
    ).rejects.toThrow("cyclic values");
    await expect(
      first.TextField().has({ $type: "regexp" } as never),
    ).rejects.toThrow('reserved "$type" property');
    await expect(
      first.TextField().fillIn(Number.NaN as never),
    ).rejects.toThrow("numbers must be finite");
  });
});

function transport(
  commands: AgentCommand[],
  result: unknown = { ok: true },
) {
  return {
    run(command: AgentCommand): Promise<unknown> {
      commands.push(command);
      return Promise.resolve(result);
    },
  };
}
