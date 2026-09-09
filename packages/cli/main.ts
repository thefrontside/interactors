import { runCli } from "./src/cli.ts";
import process from "node:process";
import { pathToFileURL } from "node:url";

let isMain = (import.meta as ImportMeta & { readonly main?: boolean }).main ??
  (process.argv[1]
    ? import.meta.url === pathToFileURL(process.argv[1]).href
    : false);

if (isMain) {
  process.exitCode = await runCli(process.argv.slice(2));
}
