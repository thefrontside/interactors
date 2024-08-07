import { type Operation, sleep } from '@effection/core';
import { performance } from 'performance-api';
import { globals } from '@interactors/globals'

export function* converge<T>(fn: () => T): Operation<T> {
  let startTime = performance.now();
  while(true) {
    try {
      return fn();
    } catch(e) {
      let diff = performance.now() - startTime;
      if(diff > globals.interactorTimeout) {
        throw e;
      } else {
        yield sleep(1);
      }
    }
  }
}
