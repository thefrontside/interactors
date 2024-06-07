import { call, Operation } from "effection";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";
import * as esbuild from "esbuild";
import { generateImports } from "./generate-imports.ts";
import { importInteractors } from "./import-interactors.ts";
import { generateConstructors } from "./generate-constructors.ts";

export interface BuildOptions {
  outDir: string;
  modules?: [];
}
export function* build(options: BuildOptions): Operation<void> {
  let outDir = options.outDir;

  yield* call(() => mkdir(outDir, { recursive: true }));

  const modules = modulePaths(options);

  let modulesList = new Set([
    // NOTE: Include core by default
    "@interactors/core",
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
    new URL("../src/templates/agent.ts.template", import.meta.url).pathname;

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
      entryPoints: [`${outDir}/agent.ts`],
      bundle: true,
      outfile: `${outDir}/agent.js`,
      sourcemap: "inline",
    })
  );
  console.log(`${outDir}/agent.js`);

  yield* call(writeFile(`${outDir}/constructors.ts`, constructorsCode));
  console.log(`${outDir}/constructors.ts`);
}

export function modulePaths(options: BuildOptions): string[] {
  return (options.modules ?? []).map((name) => path.resolve(name));
}
