import { main, suspend } from "effection";
import { createRevolution, route as $route, type ServerInfo } from "revolution";

import { etagPlugin } from "./plugins/etag.ts";
import { route, sitemapPlugin } from "./plugins/sitemap.ts";
import { currentRequestPlugin } from "./plugins/current-request.ts";
import { tailwindPlugin } from "./plugins/tailwind.ts";

import { indexRoute } from "./routes/index.tsx";
import { docsRedirect, docsRoute } from "./routes/docs-route.tsx";
import { apiIndexRoute } from "./routes/api-index-route.tsx";
import { apiPackageRoute, apiRoute } from "./routes/api-route.tsx";
import { assetsRoute } from "./routes/assets-route.ts";

import { initDocs } from "./lib/docs.ts";
import { initApi } from "./lib/api.ts";

if (import.meta.main) {
  await main(function* () {
    yield* initDocs();
    yield* initApi();

    let revolution = createRevolution({
      app: [
        route("/", indexRoute()),
        route("/docs", docsRedirect()),
        route("/docs/:id", docsRoute()),
        route("/api", apiIndexRoute()),
        route("/api/:pkg", apiPackageRoute()),
        route("/api/:pkg/:symbol", apiRoute()),
        $route("/assets(.*)", assetsRoute("assets")),
      ],
      plugins: [
        yield* tailwindPlugin({ input: "main.css", outdir: "tailwind" }),
        currentRequestPlugin(),
        etagPlugin(),
        sitemapPlugin(),
      ],
    });

    let server = yield* revolution.start();
    console.log(`www -> ${urlFromServer(server)}`);

    yield* suspend();
  });
}

function urlFromServer(server: ServerInfo) {
  return new URL(
    "/",
    `http://${
      server.hostname === "0.0.0.0" ? "localhost" : server.hostname
    }:${server.port}`,
  );
}
