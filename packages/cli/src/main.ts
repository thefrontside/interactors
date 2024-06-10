import { main } from "effection";
import yargs from "yargs";

import { build } from "./build.js";
import { dev } from "./dev.js";

const commands = { build, dev } as const;

main(function* (argv) {
  let args = yargs
    .scriptName("interactors")
    .command(
      "build [modules...]",
      "build an agent.ts for interactors found in MODULES",
      (yargs) =>
        yargs
          .option(...outDirOption()),
    )
    .command(
      "dev [modules...]",
      "continuously rebuild and test an agent.ts for interactors ",
      (yargs) =>
        yargs
          .option(...outDirOption())
	  .option('repl', {
	    type: 'string',
	    description: 'develop interactors on page at URL'
	  }),
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
