import type { JSXElement } from "revolution";
import { respondNotFound, useParams } from "revolution";

import { type RoutePath, type SitemapRoute } from "../plugins/sitemap.ts";
import { type DocsPage, useDocs } from "../lib/docs.ts";
import { useAppHtml } from "./app.html.tsx";
import type { Operation } from "effection";

export function docsRedirect(): SitemapRoute<JSXElement> {
  return {
    handler: function* () {
      let docs = yield* useDocs();
      let page = yield* docs.first();
      return (
        <html>
          <head>
            <meta
              http-equiv="refresh"
              content={`0;url=/docs/${page.id}`}
            />
            <link rel="canonical" href={`/docs/${page.id}`} />
          </head>
          <body>
            <a href={`/docs/${page.id}`}>Redirecting...</a>
          </body>
        </html>
      );
    },
  };
}

export function docsRoute(): SitemapRoute<JSXElement> {
  return {
    *routemap(pathname) {
      let docs = yield* useDocs();
      let pages = yield* docs.all();
      let paths: RoutePath[] = [];
      for (let page of pages) {
        paths.push({ pathname: pathname({ id: page.id }) });
      }
      return paths;
    },
    *handler() {
      let { id } = yield* useParams<{ id: string }>();

      let docs = yield* useDocs();
      let page = yield* docs.get(id);

      if (!page) {
        return yield* respondNotFound();
      }

      let { topics } = page;

      let AppHtml = yield* useAppHtml({
        title: `${page.title} | Interactors`,
        description: `Interactors documentation: ${page.title}`,
        hasLeftSidebar: true,
      });

      let topicsList = [];

      for (let topic of topics) {
        let items = [];
        for (let item of topic.items) {
          if (page.id !== item.id) {
            items.push(
              <li class="mt-1">
                <a
                  class="rounded px-4 block w-full py-2 hover:bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-skyblue"
                  href={`/docs/${item.id}`}
                >
                  {item.title}
                </a>
              </li>,
            );
          } else {
            items.push(
              <li class="mt-1">
                <a class="rounded px-4 block w-full py-2 bg-gray-100 text-gray-800 cursor-default">
                  {item.title}
                </a>
              </li>,
            );
          }
        }
        topicsList.push(
          <hgroup class="mb-2">
            <h3 class="font-semibold text-gray-900">
              {topic.name}
            </h3>
            <menu class="text-gray-700">{items}</menu>
          </hgroup>,
        );
      }

      return (
        <AppHtml>
          <section class="min-h-0 mx-auto w-full justify-items-normal md:grid md:grid-cols-[225px_auto] md:gap-4">
            <aside class="min-h-0 overflow-auto hidden md:block top-[72px] sticky h-fit py-4">
              <nav>{topicsList}</nav>
            </aside>
            <article class="prose max-w-full px-6 py-2 prose-headings:text-blue-primary prose-a:text-skyblue prose-a:underline">
              <h1>{page.title}</h1>
              <>{page.content}</>
              {yield* NextPrevLinks({ page })}
            </article>
          </section>
        </AppHtml>
      );
    },
  };
}

function* NextPrevLinks({
  page,
}: {
  page: DocsPage;
}): Operation<JSXElement> {
  let { next, prev } = page;
  return (
    <menu class="grid grid-cols-2 my-10 gap-x-2 xl:gap-x-20 2xl:gap-x-40 text-lg list-none p-0">
      {prev
        ? (
          <li class="col-start-1 text-left font-light border rounded-lg p-4">
            Previous
            <a
              class="py-2 block text-xl font-bold text-blue-primary no-underline tracking-wide leading-5 before:content-['\00AB\00A0'] before:font-normal"
              href={`/docs/${prev.id}`}
            >
              {prev.title}
            </a>
          </li>
        )
        : <li />}
      {next
        ? (
          <li class="col-start-2 text-right font-light border rounded-lg p-4">
            Next
            <a
              class="py-2 block text-xl font-bold text-blue-primary no-underline tracking-wide leading-5 after:content-['\00A0\00BB'] after:font-normal"
              href={`/docs/${next.id}`}
            >
              {next.title}
            </a>
          </li>
        )
        : <li />}
    </menu>
  );
}
