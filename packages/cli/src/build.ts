import { call, Operation } from "effection";
import { readFile, writeFile } from "fs/promises";
import { generateImports } from "./generate-imports.ts";
import { importInteractors } from "./import-interactors.ts";
import { generateConstructors } from "./generate-constructors.ts";

export interface BuildOptions {
  outDir: string;
}
export function* build(options: BuildOptions): Operation<void> {
  let outDir = options.outDir;

  let modulesList = new Set([
    // NOTE: Include core by default
    "@interactors/core",
    "@interactors/html",
  ]);

  let imports: { [moduleName: string]: Record<string, unknown> } = {};

  for (let moduleName of modulesList) {
    imports[moduleName] = (yield* call(import(moduleName))) as Record<
      string,
      unknown
    >;
  }

  let templatePath =
    new URL("../src/templates/agent.ts.template", import.meta.url).pathname;

  let agentTemplate = yield* call(readFile(templatePath, "utf8"));

  let importedModules = importInteractors(imports);

  let importCode = generateImports(importedModules);

  let constructorsCode = generateConstructors(importCode, importedModules);

  yield* call(
    writeFile(`${outDir}/agent.ts`, [importCode, agentTemplate].join("\n")),
  );
  yield* call(writeFile(`${outDir}/constructors.ts`, constructorsCode));
}
