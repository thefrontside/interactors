import type { Operation } from "effection";
import type { RevolutionPlugin } from "revolution";

import { createContext } from "effection";

const CurrentRequest = createContext<Request>("Request");

export function currentRequestPlugin(): RevolutionPlugin {
  return {
    *http(request, next) {
      yield* CurrentRequest.set(request);
      return yield* next(request);
    },
  };
}

export function* useCurrentRequest() {
  return yield* CurrentRequest.expect();
}

export function* useAbsoluteUrl(path: string): Operation<string> {
  let absolute = yield* useAbsoluteUrlFactory();
  return absolute(path);
}

export function* useAbsoluteUrlFactory(): Operation<(path: string) => string> {
  let request = yield* useCurrentRequest();

  return (path) => {
    if (path.startsWith("/")) {
      let url = new URL(request.url);
      url.pathname = path;
      url.search = "";
      return url.toString();
    } else {
      return new URL(path, request.url).toString();
    }
  };
}
