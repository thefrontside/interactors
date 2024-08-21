import { buildNpm } from '../../../tasks/build-npm.ts'


let [version] = Deno.args;
if (!version) {
  throw new Error("a version argument is required to build the npm package");
}

const { default: denoJson } = await import('../deno.json', { with: { type: "json" } })
const { default: packageJson } = await import('../package.json', { with: { type: "json" } })

await buildNpm({
  version,
  entryPoint: import.meta.resolve('../mod.ts'),
  imports: denoJson.imports,
  packageJson
})
