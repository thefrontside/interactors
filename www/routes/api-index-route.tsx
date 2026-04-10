import type { JSXElement } from "revolution";
import { type SitemapRoute } from "../plugins/sitemap.ts";
import { useApi } from "../lib/api.ts";
import { useAppHtml } from "./app.html.tsx";

export function apiIndexRoute(): SitemapRoute<JSXElement> {
  return {
    *routemap(generate) {
      return [{ pathname: generate() }];
    },
    handler: function* () {
      let packages = yield* useApi();

      let AppHtml = yield* useAppHtml({
        title: "API Reference | Interactors",
        description: "API Reference for Interactors packages",
      });

      let sections = [];
      for (let pkg of packages) {
        let symbols = yield* pkg.symbols();

        let items = [];
        for (let sym of symbols) {
          items.push(
            <li class="list-none pb-1">
              <a
                class="text-skyblue hover:underline"
                href={`/api/${pkg.slug}/${sym.name}`}
              >
                <span class="inline-block w-20 text-xs text-gray-400 font-mono">
                  {sym.kind}
                </span>
                {sym.name}
              </a>
            </li>,
          );
        }

        sections.push(
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-4">{pkg.name}</h2>
            <ul class="columns-1 md:columns-2 lg:columns-3 pl-0">
              {...items}
            </ul>
          </section>,
        );
      }

      return (
        <AppHtml>
          <article class="prose max-w-full prose-headings:text-blue-primary">
            <h1>API Reference</h1>
            {...sections}
          </article>
        </AppHtml>
      );
    },
  };
}
