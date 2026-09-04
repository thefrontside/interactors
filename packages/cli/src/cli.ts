import { relative } from "node:path";
import { compile, type CompileOptions } from "./compile.ts";

export interface CliIO {
  readonly stdout: (message: string) => void;
  readonly stderr: (message: string) => void;
}

export interface CliDependencies {
  readonly compile: (options: CompileOptions) => Promise<{
    readonly agentPath: string;
    readonly registryPath: string;
    readonly declarationsPath: string;
  }>;
}

const usage = `Usage: interactors compile <entrypoint> [--outdir <directory>]

Compile an Interactor entrypoint into a browser agent, registry, and types.

Options:
  -o, --outdir <directory>  Output directory (default: dist)
  -h, --help                Show this help`;

export async function runCli(
  args: readonly string[],
  io: CliIO = {
    stdout: console.log,
    stderr: console.error,
  },
  dependencies: CliDependencies = { compile },
): Promise<number> {
  if (args.includes("--help") || args.includes("-h")) {
    io.stdout(usage);
    return 0;
  }

  try {
    let options = parseCompileArgs(args);
    let result = await dependencies.compile(options);

    io.stdout(`created ${displayPath(result.agentPath)}`);
    io.stdout(`created ${displayPath(result.registryPath)}`);
    io.stdout(`created ${displayPath(result.declarationsPath)}`);
    return 0;
  } catch (error) {
    io.stderr(error instanceof Error ? error.message : String(error));
    io.stderr(usage);
    return 1;
  }
}

export function parseCompileArgs(args: readonly string[]): CompileOptions {
  let [command, ...rest] = args;
  if (command !== "compile") {
    throw new Error(
      command ? `Unknown command: ${command}` : "A command is required",
    );
  }

  let entrypoint: string | undefined;
  let outdir = "dist";

  for (let index = 0; index < rest.length; index++) {
    let argument = rest[index];

    if (argument === "--outdir" || argument === "-o") {
      let value = rest[++index];
      if (!value) {
        throw new Error(`${argument} requires a directory`);
      }
      outdir = value;
    } else if (argument.startsWith("--outdir=")) {
      let value = argument.slice("--outdir=".length);
      if (!value) {
        throw new Error("--outdir requires a directory");
      }
      outdir = value;
    } else if (argument.startsWith("-")) {
      throw new Error(`Unknown option: ${argument}`);
    } else if (entrypoint) {
      throw new Error(`Unexpected argument: ${argument}`);
    } else {
      entrypoint = argument;
    }
  }

  if (!entrypoint) {
    throw new Error("An interactor entrypoint is required");
  }

  return { entrypoint, outdir };
}

function displayPath(path: string): string {
  let display = relative(Deno.cwd(), path);
  return display || ".";
}
