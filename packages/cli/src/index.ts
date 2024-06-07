import { main } from "effection";
import { cli } from "./cli.ts";

main(cli(process.argv.slice(2)));
