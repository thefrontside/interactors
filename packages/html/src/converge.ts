import { bigtestGlobals } from '@bigtest/globals';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function converge<T>(fn: () => T): Promise<T> {
  let startTime = window.performance.now();
  while(true) {
    try {
      return fn();
    } catch(e) {
      let diff = window.performance.now() - startTime;
      if(diff > bigtestGlobals.defaultInteractorTimeout) {
        throw e;
      } else {
        await wait(1);
      }
    }
  }
}
