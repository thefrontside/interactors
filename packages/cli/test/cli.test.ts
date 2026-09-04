import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { parseCompileArgs, runCli } from "../src/cli.ts";

describe("interactors compile", () => {
  it("parses the entrypoint and output directory", () => {
    expect(parseCompileArgs(["compile", "index.ts", "--outdir", "build"]))
      .toEqual({ entrypoint: "index.ts", outdir: "build" });
    expect(parseCompileArgs(["compile", "index.ts", "-o", "build"]))
      .toEqual({ entrypoint: "index.ts", outdir: "build" });
    expect(parseCompileArgs(["compile", "index.ts", "--outdir=build"]))
      .toEqual({ entrypoint: "index.ts", outdir: "build" });
    expect(parseCompileArgs(["compile", "index.ts"]))
      .toEqual({ entrypoint: "index.ts", outdir: "dist" });
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

  it("rejects malformed commands without compiling", async () => {
    let stderr: string[] = [];
    let exitCode = await runCli(
      ["compile", "index.ts", "--unknown"],
      { stdout: () => undefined, stderr: (message) => stderr.push(message) },
      { compile: () => Promise.reject(new Error("should not run")) },
    );

    expect(exitCode).toBe(1);
    expect(stderr[0]).toBe("Unknown option: --unknown");
  });
});
