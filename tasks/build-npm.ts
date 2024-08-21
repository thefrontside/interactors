import { build, emptyDir, PackageJson } from "@deno/dnt";

export interface Options {
  version: string
  entryPoint: string
  imports: Record<string, string>
  packageJson: PackageJson
}

export async function buildNpm({ version, entryPoint, imports, packageJson }: Options) {
  const outDir = new URL("./build/npm", entryPoint);

  await emptyDir(outDir);

  const { default: rootDenoJson } = await import('../deno.json', { with: { type: "json" } })

  const packages = await Promise.all(
    rootDenoJson.workspace
    .map(packagePath => import(`../${packagePath}/deno.json`, { with: { type: 'json' } }))
  )

  const workspaceImports = Object.fromEntries(
    packages.map(
      ({ default: pkgDenoJson }) => [
        pkgDenoJson.name,
        `npm:${pkgDenoJson.name}@^${pkgDenoJson.version}`
      ]
    )
  )

  const tmpImportMapFile = new URL(import.meta.resolve(`../imports-${Date.now()}.json`))

  await Deno.writeTextFile(
    tmpImportMapFile,
    JSON.stringify({
      imports: {
        ...imports,
        ...workspaceImports
      }
    })
  )

  try {
    await build({
      importMap: tmpImportMapFile.toString(),
      entryPoints: [entryPoint],
      outDir: outDir.toString(),
      shims: {
        deno: false,
      },
      test: false,
      typeCheck: false,
      compilerOptions: {
        lib: ["ESNext", "DOM"],
        target: "ES2020",
        sourceMap: true,
      },
      package: {
        ...packageJson,
        version,
      }
    });

    await Deno.copyFile(new URL("./README.md", entryPoint), new URL(`${outDir}/README.md`));
  } finally {
    await Deno.remove(tmpImportMapFile)
  }
}
