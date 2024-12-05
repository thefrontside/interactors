import { performance } from "performance-api";
import { globals } from "@interactors/globals";

export async function converge<T>(fn: () => T): Promise<T> {
  let startTime = performance.now();
  while (true) {
    try {
      return fn();
    } catch (e) {
      let diff = performance.now() - startTime;
      if (diff > globals.interactorTimeout) {
        throw e;
      } else {
        await sleep(1);
      }
    }
  }
}

async function sleep(durationMS: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, durationMS));
}
