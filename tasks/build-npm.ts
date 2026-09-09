import { build, emptyDir, PackageJson } from "@deno/dnt";

export interface Options {
  version: string;
  entryPoint: string;
  imports: Record<string, string>;
  packageJson: PackageJson;
}

export async function buildNpm(packageDirectory: string) {
  packageDirectory = packageDirectory.replace(/^\.\/+/, "").replace(/\/+$/, "");

  const { default: denoJson } = await import(
    `../${packageDirectory}/deno.json`,
    {
      with: { type: "json" },
    }
  );

  const outDir = new URL(`../${packageDirectory}/build/npm`, import.meta.url);

  await emptyDir(outDir);

  const { default: rootDenoJson } = await import("../deno.json", {
    with: { type: "json" },
  });

  const packages = await Promise.all(
    rootDenoJson.workspace.map(
      (packagePath) =>
        import(`../${packagePath}/deno.json`, { with: { type: "json" } }),
    ),
  );

  const workspaceImports = Object.fromEntries(
    packages.map(({ default: pkgDenoJson }) => [
      pkgDenoJson.name,
      `npm:${pkgDenoJson.name}@^${pkgDenoJson.version}`,
    ]),
  );

  const tmpImportMapFile = new URL(
    import.meta.resolve(`../${packageDirectory}/imports-${Date.now()}.json`),
  );

  await Deno.writeTextFile(
    tmpImportMapFile,
    JSON.stringify({
      imports: {
        ...denoJson.imports,
        ...workspaceImports,
      },
    }),
  );

  try {
    let entryPoints = packageDirectory === "packages/cli"
      ? [
        {
          name: ".",
          path: `${packageDirectory}/mod.ts`,
          kind: "export" as const,
        },
        {
          name: "interactors",
          path: `${packageDirectory}/main.ts`,
          kind: "bin" as const,
        },
      ]
      : [`${packageDirectory}/mod.ts`];

    await build({
      importMap: tmpImportMapFile.toString(),
      entryPoints,
      outDir: outDir.toString(),
      shims: {
        deno: false,
      },
      scriptModule: packageDirectory === "packages/cli" ? false : "cjs",
      test: false,
      typeCheck: false,
      compilerOptions: {
        lib: ["ESNext", "DOM"],
        target: "ES2020",
        sourceMap: true,
      },
      package: {
        name: denoJson.name,
        version: denoJson.version,
        description: denoJson.description,
        license: "MIT",
        homepage: "https://frontside.com/interactors",
        author: "Frontside Engineering <engineering@frontside.com>",
        repository: {
          type: "git",
          url: "git+https://github.com/thefrontside/interactors.git",
          directory: packageDirectory,
        },
        bugs: {
          url: "https://github.com/thefrontside/interactors/issues",
        },
        dependencies: packageDirectory === "packages/core"
          ? { "@testing-library/dom": "^8.18.1" }
          : packageDirectory === "packages/cli"
          ? { typescript: "^5.9.3" }
          : undefined,
        sideEffects: false,
      },
    });

    await Deno.copyFile(
      new URL(`../${packageDirectory}/README.md`, import.meta.url),
      new URL(`${outDir}/README.md`),
    );
  } finally {
    await Deno.remove(tmpImportMapFile);
  }
}

const [packageDirectory] = Deno.args;
if (!packageDirectory) {
  throw new Error(
    "a packageDirectory argument is required to build the npm package",
  );
}

await buildNpm(packageDirectory);
