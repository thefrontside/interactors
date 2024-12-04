import { main, type Task, useScope } from "effection";

import { command, parser } from "zod-opts";
import { z } from "npm:zod";

import { build } from "./build.ts";
//import { dev } from "./dev.ts";

//const commands = { build, dev } as const;

await main(function* (argv) {
  let task: Task<void> | undefined = undefined;
  
  let scope = yield* useScope();
  parser()
    .name("interactors")
    .description("build and test interactors")
    .version("0.0.0")
    .subcommand(
      command("build").description(
        "build an agent for interactors found in MODULES",
      ).args([
        {
	  name: "modules",
	  type: z.array(z.string()).optional(),
	  description: "paths of modules containing interactors to include in the agent "
	},
      ]).options({
	"outDir": {
	  type: z.string().default("./build"),
	  alias: "o",	  
	  description: "the output directory for generated files",
	},
      }).action((options) => {
        task = scope.run(() => build(options));
      }),
    )
    .parse(argv);

  if (typeof task !== 'undefined') {
    //@ts-expect-error effection is too good.
    yield* task;
  }
});

