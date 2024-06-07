import { createSignal, Operation, resource, Stream } from "effection";
import chokidar from "chokidar";
import { build, BuildOptions, modulePaths } from "./build.ts";
import { Stats } from "node:fs";

export interface DevOptions extends BuildOptions {
  outDir: string;
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

export interface WatchEvent {
  path: string;
  stats?: Stats;
}

function useWatcher(paths: string[]): Stream<WatchEvent, never> {
  return resource(function* (provide) {
    let { send, ...subscribe } = createSignal<WatchEvent>();

    let watcher = chokidar.watch(paths);

    watcher.on("change", (path, stats) => send({ path, stats }));

    try {
      yield* provide(yield* subscribe);
    } finally {
      watcher.close();
    }
  });
}
