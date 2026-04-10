import { RevolutionPlugin } from "revolution";
import { encodeBase64 } from "@std/encoding/base64";

const DEPLOYMENT_ID =
  Deno.env.get("DENO_DEPLOYMENT_ID") ||
  crypto.randomUUID();

const DEPLOYMENT_ID_HASH = await crypto.subtle.digest(
  "SHA-1",
  new TextEncoder().encode(DEPLOYMENT_ID),
);

const ETAG = `"${encodeBase64(DEPLOYMENT_ID_HASH)}"`;
const WEAK_ETAG = `W/"${encodeBase64(DEPLOYMENT_ID_HASH)}"`;

export function etagPlugin(): RevolutionPlugin {
  return {
    *http(request, next) {
      let ifNoneMatch = request.headers.get("if-none-match");
      if (ifNoneMatch === ETAG || ifNoneMatch === WEAK_ETAG) {
        return new Response(null, {
          status: 304,
          statusText: "Not Modified",
        });
      } else {
        let response = yield* next(request);
        if (!response.headers.get("etag")) {
          let tagged = new Response(response.body, response);
          tagged.headers.set("etag", ETAG);
          return tagged;
        }
        return response;
      }
    },
  };
}
