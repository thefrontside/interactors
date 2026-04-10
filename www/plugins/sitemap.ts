import type { Middleware, RevolutionPlugin } from "revolution";
import { route as revolutionRoute, useRevolutionOptions } from "revolution";
import type { Operation } from "effection";
import { useAbsoluteUrlFactory } from "./current-request.ts";
import { compile } from "path-to-regexp";

export function sitemapPlugin(): RevolutionPlugin {
  return {
    *http(request, next) {
      let options = yield* useRevolutionOptions();
      let url = new URL(request.url);

      if (url.pathname === "/sitemap.xml") {
        let app = options.app ?? [];
        let paths: RoutePath[] = [];
        for (let middleware of app) {
          let ext = middleware as SitemapExtension;
          if (ext.sitemapExtension) {
            paths = paths.concat(yield* ext.sitemapExtension(request));
          }
        }

        let absolute = yield* useAbsoluteUrlFactory();

        let urls = paths.map((path) => {
          let { pathname, ...entry } = path;
          let loc = absolute(pathname);
          let parts = [`    <url>\n      <loc>${escapeXml(loc)}</loc>`];
          if (entry.lastmod) {
            parts.push(`      <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
          }
          if (entry.changefreq) {
            parts.push(
              `      <changefreq>${escapeXml(entry.changefreq)}</changefreq>`,
            );
          }
          if (entry.priority !== undefined) {
            parts.push(
              `      <priority>${entry.priority}</priority>`,
            );
          }
          parts.push(`    </url>`);
          return parts.join("\n");
        });

        let xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          status: 200,
          headers: {
            "Content-Type": "application/xml",
          },
        });
      }
      return yield* next(request);
    },
  };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export interface SitemapExtension {
  sitemapExtension?(request: Request): Operation<RoutePath[]>;
}

export interface RoutePath {
  pathname: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export interface SitemapRoute<T> {
  handler: Middleware<Request, T>;
  routemap?(
    generate: (params?: Record<string, string>) => string,
    request: Request,
  ): Operation<RoutePath[]>;
}

export function route<T>(
  pattern: string,
  middleware: Middleware<Request, T> | SitemapRoute<T>,
): Middleware<Request, T> {
  if (isSitemapRoute<T>(middleware)) {
    let handler = revolutionRoute(pattern, middleware.handler);
    if (middleware.routemap) {
      let { routemap } = middleware;
      Object.defineProperty(handler, "sitemapExtension", {
        value(request: Request) {
          let generate = compile(pattern, { encode: false });
          return routemap(generate, request);
        },
      });
    }
    return handler;
  } else {
    return revolutionRoute(pattern, middleware);
  }
}

function isSitemapRoute<T>(
  o: Middleware<Request, T> | SitemapRoute<T>,
): o is SitemapRoute<T> {
  return !!(o as SitemapRoute<T>).handler;
}
