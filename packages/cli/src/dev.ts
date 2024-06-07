import { Operation } from "effection";
import { build, BuildOptions, modulePaths } from "./build.ts";
import { useWatcher } from "./watcher.ts";

export interface DevOptions extends BuildOptions {
  outDir: string;
  repl?: string;
}

export function* dev(options: DevOptions): Operation<void> {
  let paths = modulePaths(options);

  let updates = yield* useWatcher(paths);

  while (true) {
    yield* build(options);
    yield* updates.next();
    console.log("changes detected, rebuilding...");
  }
}
