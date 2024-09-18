import * as path from "https://deno.land/std@0.188.0/path/mod.ts";

export interface Options {
  gitTag: string;
}

export async function deriveFromGitTag([argName, gitTag]: [
  argName: string,
  gitTag: string
]) {
  if (argName !== "--gitTag")
    throw new Error("First option needs to be --gitTag");

  const { default: covectorConfig } = await import("../.changes/config.json", {
    with: { type: "json" },
  });
  const [pkg, _] = gitTag.replace("refs/tags/", "").split("-v");
  // @ts-expect-error let's undefined check
  const pkgConfig = covectorConfig.packages[pkg];
  if (!pkgConfig) throw new Error(`${pkg} not defined in .changes/config.json`);

  const dir = path.dirname(pkgConfig.path);
  const outputVarDir = `working-directory=${dir}`;

  if (Deno.env.has("GITHUB_OUTPUT")) {
    // type cast because TS isn't narrow despite our check
    const githubOutput = Deno.env.get("GITHUB_OUTPUT") as string;
    // write it to the output
    await Deno.writeTextFile(githubOutput, outputVarDir, {
      append: true,
    });
  } else {
    // for local dev
    console.log(outputVarDir);
  }
}

// @ts-expect-error ignore additional args
deriveFromGitTag(Deno.args);
