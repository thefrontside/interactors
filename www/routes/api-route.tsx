import type { JSXElement } from "revolution";
import { respondNotFound, useParams } from "revolution";
import { type RoutePath, type SitemapRoute } from "../plugins/sitemap.ts";
import { useApi, useApiPackage } from "../lib/api.ts";
import { useAppHtml } from "./app.html.tsx";

export function apiRoute(): SitemapRoute<JSXElement> {
  return {
    *routemap(generate) {
      let packages = yield* useApi();
      let paths: RoutePath[] = [];
      for (let pkg of packages) {
        let symbols = yield* pkg.symbols();
        for (let sym of symbols) {
          paths.push({
            pathname: generate({ pkg: pkg.slug, symbol: sym.name }),
          });
        }
      }
      return paths;
    },
    *handler() {
      let params = yield* useParams<{ pkg: string; symbol: string }>();

      let pkg = yield* useApiPackage(params.pkg);
      if (!pkg) {
        return yield* respondNotFound();
      }

      let sym = yield* pkg.symbol(params.symbol);
      if (!sym) {
        return yield* respondNotFound();
      }

      let symbols = yield* pkg.symbols();

      let AppHtml = yield* useAppHtml({
        title: `${sym.name} | ${pkg.name} | Interactors API`,
        description: sym.description || `API documentation for ${sym.name}`,
        hasLeftSidebar: true,
      });

      let sidebar = [];
      for (let s of symbols) {
        if (s.name === sym.name) {
          sidebar.push(
            <li class="mt-1">
              <span class="rounded px-4 block w-full py-1 bg-gray-100 text-gray-800 text-sm cursor-default">
                {s.name}
              </span>
            </li>,
          );
        } else {
          sidebar.push(
            <li class="mt-1">
              <a
                class="rounded px-4 block w-full py-1 hover:bg-gray-100 text-gray-800 text-sm"
                href={`/api/${pkg.slug}/${s.name}`}
              >
                {s.name}
              </a>
            </li>,
          );
        }
      }

      return (
        <AppHtml>
          <section class="min-h-0 mx-auto w-full md:grid md:grid-cols-[225px_auto] md:gap-4">
            <aside class="min-h-0 overflow-auto hidden md:block top-[72px] sticky h-fit py-4">
              <hgroup class="mb-2">
                <h3 class="font-semibold text-sm">
                  <a href="/api" class="hover:underline">{pkg.name}</a>
                </h3>
                <menu class="text-gray-700 list-none p-0">{...sidebar}</menu>
              </hgroup>
            </aside>
            <article class="prose max-w-full px-6 py-2 prose-headings:text-blue-primary prose-a:text-skyblue prose-a:underline">
              <h1>
                {sym.name}
                <span class="ml-3 text-sm font-normal text-gray-400 font-mono align-middle">
                  {sym.kind}
                </span>
              </h1>
              <>{sym.content}</>
              <p class="text-sm text-gray-400 mt-8">
                <a href={`/api/${pkg.slug}`} class="no-underline hover:underline">
                  &larr; Back to {pkg.name}
                </a>
              </p>
            </article>
          </section>
        </AppHtml>
      );
    },
  };
}

export function apiPackageRoute(): SitemapRoute<JSXElement> {
  return {
    *routemap(generate) {
      let packages = yield* useApi();
      let paths: RoutePath[] = [];
      for (let pkg of packages) {
        paths.push({ pathname: generate({ pkg: pkg.slug }) });
      }
      return paths;
    },
    *handler() {
      let params = yield* useParams<{ pkg: string }>();

      let pkg = yield* useApiPackage(params.pkg);
      if (!pkg) {
        return yield* respondNotFound();
      }

      let symbols = yield* pkg.symbols();

      let AppHtml = yield* useAppHtml({
        title: `${pkg.name} | Interactors API`,
        description: `API documentation for ${pkg.name}`,
      });

      let grouped = new Map<string, typeof symbols>();
      for (let sym of symbols) {
        let group = grouped.get(sym.kind) ?? [];
        group.push(sym);
        grouped.set(sym.kind, group);
      }

      let sections = [];
      for (let [kind, syms] of grouped) {
        let items = [];
        for (let s of syms) {
          items.push(
            <li class="list-none pb-1">
              <a
                class="text-skyblue hover:underline"
                href={`/api/${pkg.slug}/${s.name}`}
              >
                {s.name}
              </a>
            </li>,
          );
        }
        sections.push(
          <section class="mb-8">
            <h2 class="capitalize">{kind}s</h2>
            <ul class="columns-1 md:columns-2 lg:columns-3 pl-0">
              {...items}
            </ul>
          </section>,
        );
      }

      return (
        <AppHtml>
          <article class="prose max-w-full prose-headings:text-blue-primary">
            <h1>{pkg.name}</h1>
            {...sections}
            <p class="text-sm text-gray-400">
              <a href="/api" class="no-underline hover:underline">
                &larr; All packages
              </a>
            </p>
          </article>
        </AppHtml>
      );
    },
  };
}
