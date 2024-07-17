import { call, Operation } from "effection";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import * as path from "node:path";
import * as esbuild from "esbuild";
import { generateConstructors } from "./generate-constructors.js";

export interface BuildOptions {
  outDir: string;
  transform?: string;
  modules?: [];
}

function resolveRelativePath(modulePath: string, outDir: string) {
  return modulePath.startsWith('.') ? path.relative(outDir, path.resolve(modulePath)) : modulePath;
}

export function* build(options: BuildOptions): Operation<void> {
  let outDir = options.outDir;

  yield* call(mkdir(outDir, { recursive: true }));

  let { modules, agentScriptPath, constructorsPath } = buildAttrs(options);

  let modulesList = new Set([
    // NOTE: Include core by default
    // "@interactors/core",
    "@interactors/html",
    ...modules,
  ]);

  let modulesSource = `export const modules = async () => ({
  ${[...modulesList].map(moduleName => `["${moduleName}"]: await import("${resolveRelativePath(moduleName, outDir)}")`).join(",\n")}
});
`
  yield* call(writeFile(`${outDir}/modules.ts`, modulesSource));
  yield* call(copyFile(require.resolve("../src/templates/agent.ts"), `${outDir}/agent.ts`))
  yield* call(copyFile(require.resolve("../src/templates/interactors.ts"), `${outDir}/interactors.ts`))

  yield* call(esbuild.build({
    entryPoints: [`${outDir}/interactors.ts`],
    outfile: `${outDir}/interactors-node.mjs`,
    bundle: true,
    platform: "node",
    sourcemap: "inline",
    format: "esm",
    target: "esnext",
    banner: {
      js: `
import { createRequire } from 'node:module';
import path from 'node:path';
import url from 'node:url';

globalThis.require = createRequire(import.meta.url);
globalThis.__filename = url.fileURLToPath(import.meta.url);
globalThis.__dirname = path.dirname(__filename);
`}
  }))

  let { getImports } = (yield* call(import(path.resolve(`${outDir}/interactors-node.mjs`)))) as {
    getImports: () => Promise<{ imports: { [moduleName: string]: { interactors: { name: string }[], matchers: { name: string }[] } } }>;
  }
  let { imports } = yield* call(getImports())

  let constructorsCode = generateConstructors(imports, options.transform ? resolveRelativePath(options.transform, outDir) : undefined);

  yield* call(
    esbuild.build({
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
