import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { parseCompileArgs, runCli } from "../src/cli.ts";

describe("interactors compile", () => {
  it("parses the entrypoint and output directory", () => {
    expect(parseCompileArgs(["compile", "index.ts", "--outdir", "build"]))
      .toEqual({ entrypoint: "index.ts", outdir: "build" });
    expect(parseCompileArgs(["compile", "index.ts", "-o", "build"]))
      .toEqual({ entrypoint: "index.ts", outdir: "build" });
    expect(parseCompileArgs(["compile", "--outdir", "build", "index.ts"]))
      .toEqual({ entrypoint: "index.ts", outdir: "build" });
    expect(parseCompileArgs(["compile", "index.ts", "--outdir=build"]))
      .toEqual({ entrypoint: "index.ts", outdir: "build" });
    expect(parseCompileArgs(["compile", "index.ts"]))
      .toEqual({ entrypoint: "index.ts", outdir: "dist" });
  });

  it("renders root and command help from the command definition", async () => {
    let stdout: string[] = [];
    let dependencies = {
      compile: () => Promise.reject(new Error("should not compile")),
    };

    expect(
      await runCli(
        ["--help"],
        { stdout: (message) => stdout.push(message), stderr: () => undefined },
        dependencies,
      ),
    ).toBe(0);
    expect(stdout[0]).toContain("Usage:\n  interactors [OPTIONS] <COMMAND>");
    expect(stdout[0]).toContain("Commands:\n  compile");

    stdout = [];
    expect(
      await runCli(
        ["compile", "--help"],
        { stdout: (message) => stdout.push(message), stderr: () => undefined },
        dependencies,
      ),
    ).toBe(0);
    expect(stdout[0]).toContain("Usage:\n  compile [OPTIONS] <ENTRYPOINT>");
    expect(stdout[0]).toContain("-o, --outdir <VALUE>");
  });

  it("reports all three generated artifacts", async () => {
    let stdout: string[] = [];
    let stderr: string[] = [];
    let received: unknown;
    let exitCode = await runCli(
      ["compile", "index.ts", "--outdir", "output"],
      {
        stdout: (message) => stdout.push(message),
        stderr: (message) => stderr.push(message),
      },
      {
        compile: (options) => {
          received = options;
          return Promise.resolve({
            agentPath: `${Deno.cwd()}/output/agent.js`,
            registryPath: `${Deno.cwd()}/output/interactors.json`,
            declarationsPath: `${Deno.cwd()}/output/interactors.d.ts`,
          });
        },
      },
    );

    expect(exitCode).toBe(0);
    expect(received).toEqual({ entrypoint: "index.ts", outdir: "output" });
    expect(stdout).toEqual([
      "created output/agent.js",
      "created output/interactors.json",
      "created output/interactors.d.ts",
    ]);
    expect(stderr).toEqual([]);
  });

  it("reports compiler failures without adding parser help", async () => {
    let stderr: string[] = [];
    let exitCode = await runCli(
      ["compile", "missing.ts"],
      { stdout: () => undefined, stderr: (message) => stderr.push(message) },
      { compile: () => Promise.reject(new Error("entrypoint does not exist")) },
    );

    expect(exitCode).toBe(1);
    expect(stderr).toEqual(["entrypoint does not exist"]);
  });

  it("rejects malformed commands without compiling", async () => {
    for (
      let [args, message] of [
        [
          [],
          "interactors does not support EXECUTE\n\nAvailable methods:\n  HELP",
        ],
        [["unknown"], "unexpected: `unknown`"],
        [["compile"], "entrypoint: must be a non-empty path"],
        [
          ["compile", "index.ts", "extra.ts"],
          "unexpected: `extra.ts`",
        ],
        [
          ["compile", "index.ts", "--unknown"],
          "unexpected: `--unknown`",
        ],
        [
          ["compile", "index.ts", "--outdir"],
          "--outdir requires a value",
        ],
        [
          ["compile", "index.ts", "--outdir="],
          "outdir: must be a non-empty path",
        ],
      ] as const
    ) {
      let stderr: string[] = [];
      let exitCode = await runCli(
        args,
        { stdout: () => undefined, stderr: (value) => stderr.push(value) },
        { compile: () => Promise.reject(new Error("should not run")) },
      );

      expect(exitCode).toBe(1);
      expect(stderr).toEqual([message]);
    }
  });
});
