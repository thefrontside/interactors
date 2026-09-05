import { relative } from "node:path";
// @ts-types="../vendor/configliere-types/mod.d.ts"
import {
  argument,
  cli,
  command,
  description,
  name,
  option,
  parse as parseConfigliere,
  printErrors as printConfigliereErrors,
  printHelp as printConfigliereHelp,
  route,
  routes,
  type Schema,
  schema,
} from "../vendor/configliere.js";
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

const application = route(
  name("interactors"),
  description("Compile Interactors for browser test runners."),
  routes(
    command(
      name("compile"),
      description(
        "Compile an Interactor entrypoint into a browser agent, registry, and types.",
      ),
      argument(
        name("entrypoint"),
        description("Module that exports the Interactors to compile."),
        schema(path()),
      ),
      option(
        name("outdir"),
        cli(["-o", "--outdir"]),
        description("Directory for generated artifacts (default: dist)."),
        schema(path("dist")),
      ),
    ),
  ),
);

export async function runCli(
  args: readonly string[],
  io: CliIO = {
    stdout: console.log,
    stderr: console.error,
  },
  dependencies: CliDependencies = { compile },
): Promise<number> {
  if (args.length === 0) {
    io.stderr("A command is required");
    return 1;
  }

  let intent = parseConfigliere(application, { argv: [...args] });

  if (!intent.ok) {
    io.stderr(printConfigliereErrors(intent));
    return 1;
  }

  if (intent.method === "help") {
    io.stdout(printConfigliereHelp(intent));
    return 0;
  }

  if (intent.method !== "execute" || intent.route !== "/compile") {
    io.stderr("A command is required");
    return 1;
  }

  try {
    let result = await dependencies.compile(intent.model);

    io.stdout(`created ${displayPath(result.agentPath)}`);
    io.stdout(`created ${displayPath(result.registryPath)}`);
    io.stdout(`created ${displayPath(result.declarationsPath)}`);
    return 0;
  } catch (error) {
    io.stderr(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

export function parseCompileArgs(args: readonly string[]): CompileOptions {
  if (args.length === 0) {
    throw new Error("A command is required");
  }

  let intent = parseConfigliere(application, { argv: [...args] });

  if (!intent.ok) {
    throw new Error(printConfigliereErrors(intent));
  }
  if (intent.method !== "execute" || intent.route !== "/compile") {
    throw new Error("Expected the compile command");
  }

  return intent.model;
}

function path(fallback?: string): Schema<string> {
  return {
    "~standard": {
      version: 1,
      vendor: "@interactors/cli",
      validate(value: unknown) {
        if (value === undefined && fallback !== undefined) {
          return { value: fallback };
        }
        if (typeof value === "string" && value.length > 0) {
          return { value };
        }
        return { issues: [{ message: "must be a non-empty path" }] };
      },
    },
  };
}

function displayPath(path: string): string {
  let display = relative(Deno.cwd(), path);
  return display || ".";
}
