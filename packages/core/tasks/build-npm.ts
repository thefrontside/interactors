import {
  build,
  emptyDir,
} from "https://deno.land/x/dnt@0.36.0/mod.ts?pin=v123";

const outDir = "./build/npm";

await emptyDir(outDir);

let [version] = Deno.args;
if (!version) {
  throw new Error("a version argument is required to build the npm package");
}

await build({
  importMap: "./deno.json",
  entryPoints: ["./mod.ts"],
  outDir,
  shims: {
    deno: false,
  },
  test: false,
  typeCheck: false,
  compilerOptions: {
    lib: ["esnext", "dom"],
    target: "ES2020",
    sourceMap: true,
  },
  package: {
    // package.json properties
    name: "@interactors/core",
    version,
    description: "Composable page objects for components",
    license: "MIT",
    homepage: "https://frontside.com/interactors",
    author: "Frontside Engineering <engineering@frontside.com>",
    repository: {
      author: "engineering@frontside.com",
      type: "git",
      url: "git+https://github.com/thefrontside/interactors.git",
    },
    bugs: {
      url: "https://github.com/thefrontside/interactors/issues",
    },
    engines: {
      node: ">= 16",
    },
    sideEffects: false,
  },
});

await Deno.copyFile("README.md", `${outDir}/README.md`);
