import { createSignal, resource, Stream } from "effection";
import chokidar from "chokidar";
import { Stats } from "node:fs";

export interface WatchEvent {
  path: string;
  stats?: Stats;
}

export function useWatcher(paths: string[]): Stream<WatchEvent, never> {
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
