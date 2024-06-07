import { main } from "effection";
import yargs from "yargs";

import { build } from "./build.ts";

const commands = { build } as const;

main(function* (argv) {
  let args = yargs
    .scriptName("interactors")
    .command(
      "build ...MODULES [OPTIONS]",
      "build an agent.ts for interactors found in MODULES",
      (yargs) => yargs.option(...outDirOption()),
    )
    .command(
      "dev ...MODULES [OPTIONS]",
      "continuously rebuild",
      (yargs) => yargs.option(...outDirOption()),
    )
    .help()
    .parse(argv);

  let [commandName] = args["_"] as [keyof typeof commands];

  let command = commands[commandName];

  yield* command(args as unknown as Parameters<typeof command>[0]);
});

function outDirOption() {
  return ["outDir", {
    alias: "o",
    default: "./build",
    desc: "the output directory for generated files",
  }] as const;
}
