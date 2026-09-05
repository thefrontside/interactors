import { runCli } from "./src/cli.ts";

if (import.meta.main) {
  Deno.exit(await runCli(Deno.args));
}
