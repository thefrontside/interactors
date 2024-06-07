import { Operation } from "effection";
import { build, buildAttrs, BuildOptions } from "./build.ts";
import { useWatcher } from "./watcher.ts";
import { useTestPage } from "./test-page.ts";

export interface DevOptions extends BuildOptions {
  repl?: string;
}

export function* dev(options: DevOptions): Operation<void> {
  let { modules } = buildAttrs(options);

  let updates = yield* useWatcher(modules);

  let page = options.repl ? yield* useTestPage(options.repl, options) : { *update() {} };

  while (true) {
    yield* build(options);
    yield* page.update();
    yield* updates.next();
    console.log("changes detected, rebuilding...");
  }
}
