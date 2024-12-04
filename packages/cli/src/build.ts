import { call, type Operation } from "effection";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";
import * as esbuild from "esbuild";
import { generateImports } from "./generate-imports.ts";
import { importInteractors } from "./import-interactors.ts";
import { generateConstructors } from "./generate-constructors.ts";

import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.0";


export interface BuildOptions {
  outDir: string;
  modules?: string[];
}

export function* build(options: BuildOptions): Operation<void> {
  let outDir = options.outDir;

  yield* call(() => mkdir(outDir, { recursive: true }));

  let { modules, agentScriptPath, constructorsPath } = buildAttrs(options);

  let modulesList = new Set([
    // NOTE: Include core by default
    // "@interactors/core",
    "@interactors/html",
    ...modules,
  ]);

  let imports: { [moduleName: string]: Record<string, unknown> } = {};

  for (let moduleName of modulesList) {
    imports[moduleName] = (yield* call(import(moduleName))) as Record<
      string,
      unknown
    >;
  }

  // TODO use esbuild to agent

  let templatePath =
    new URL(import.meta.resolve("./templates/agent.ts.template")).pathname;

  let agentTemplate = yield* call(readFile(templatePath, "utf8"));

  let importedModules = importInteractors(imports);

  let importCode = generateImports(importedModules);

  let constructorsCode = generateConstructors(importCode, importedModules);

  yield* call(
    writeFile(`${outDir}/agent.ts`, [importCode, agentTemplate].join("\n")),
  );
  console.log(`${outDir}/agent.ts`);

  yield* call(() =>
    esbuild.build({
      plugins: [...denoPlugins()],
      entryPoints: [`${outDir}/agent.ts`],
      bundle: true,
      outfile: agentScriptPath,
      sourcemap: "inline",
    })
  );
  console.log(agentScriptPath);

  yield* call(writeFile(constructorsPath, constructorsCode));
  console.log(constructorsPath);
}

export function buildAttrs(options: BuildOptions) {
  return {
    modules: (options.modules ?? []).map((name) => path.resolve(name)),
    agentScriptPath: `${options.outDir}/agent.js`,
    constructorsPath: `${options.outDir}/constructors.ts`,
  };
}
