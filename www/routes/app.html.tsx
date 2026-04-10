import type { Operation } from "effection";
import type { JSXChild, JSXElement } from "revolution";

import {
  useAbsoluteUrl,
  useCurrentRequest,
} from "../plugins/current-request.ts";

export interface Options {
  title: string;
  description: string;
  hasLeftSidebar?: boolean;
}

export interface AppHtmlProps {
  children: JSXChild;
}

export function* useAppHtml(
  options: Options,
): Operation<({ children }: AppHtmlProps) => JSXElement> {
  let { title, description } = options;
  let request = yield* useCurrentRequest();
  let url = new URL(request.url);
  let canonicalURL = yield* useAbsoluteUrl(url.pathname);
  let ogImageURL = yield* useAbsoluteUrl("/assets/images/meta-interactors.png");

  return function AppHtml({ children }) {
    return (
      <html lang="en-US" dir="ltr">
        <head>
          <meta charset="UTF-8" />
          <title>{title}</title>
          <meta property="og:image" content={ogImageURL} />
          <meta property="og:title" content={title} />
          <meta property="og:url" content={canonicalURL} />
          <meta property="og:description" content={description} />
          <meta name="description" content={description} />
          <meta name="twitter:image" content={ogImageURL} />
          <meta name="twitter:description" content={description} />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="stylesheet" href="https://use.typekit.net/ugs0ewy.css" />
          <link rel="icon" href="/assets/images/favicon-interactors.png" />
          <link rel="canonical" href={canonicalURL} />
          <link
            href="/assets/prism-night-owl.css"
            rel="preload"
            as="style"
            // @ts-expect-error onload not on HTMLLink
            onload="this.rel='stylesheet'"
          />
          <noscript>
            <link rel="stylesheet" href="/assets/prism-night-owl.css" />
          </noscript>
        </head>
        <body class="flex flex-col min-h-screen bg-white text-blue-primary font-sans">
          <header class="sticky top-0 w-full z-10 tracking-wide text-white [background-image:linear-gradient(45deg,#14315d_-5%,#44378a,#f74d7b_105%)]">
            <div class="flex items-center justify-between max-w-screen-2xl mx-auto px-6 py-4">
              <div class="flex-none">
                <a href="/" class="flex items-center gap-x-2">
                  <img
                    src="/assets/images/icon-interactors.svg"
                    alt=""
                    width={28}
                    height={28}
                    class="drop-shadow"
                  />
                  <span class="font-extrabold text-lg tracking-wide">
                    Interactors
                  </span>
                </a>
              </div>
              <nav aria-label="Site Nav" class="flex-1">
                <ul class="flex items-center justify-end gap-4 md:gap-7 lg:gap-12">
                  <li>
                    <a
                      class="hover:text-skyblue transition-colors duration-200"
                      href="/docs/quick-start"
                    >
                      Guides
                    </a>
                  </li>
                  <li>
                    <a
                      class="hover:text-skyblue transition-colors duration-200"
                      href="/api"
                    >
                      API
                    </a>
                  </li>
                  <li>
                    <a
                      class="hover:text-skyblue transition-colors duration-200"
                      href="https://github.com/thefrontside/interactors"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      class="hover:text-skyblue transition-colors duration-200"
                      href="https://discord.gg/r6AvtnU"
                    >
                      Discord
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main class="flex-1 mx-auto max-w-screen-2xl w-full p-5">
            {children}
          </main>
          <footer class="grid grid-cols-1 md:grid-cols-3 text-center tracking-wide bg-gray-100 py-8 gap-y-4 leading-8 px-5">
            <section class="flex flex-col gap-y-1">
              <h4 class="text-sm uppercase font-bold text-blue-primary mb-4">
                About
              </h4>
              <a class="text-gray-800" href="https://frontside.com">
                Maintained by Frontside
              </a>
            </section>
            <section class="flex flex-col gap-y-1">
              <h4 class="text-sm uppercase font-bold text-blue-primary mb-4">
                OSS Projects
              </h4>
              <a class="text-gray-800" href="https://frontside.com/effection">
                Effection
              </a>
              <a class="text-gray-800" href="/">
                Interactors
              </a>
            </section>
            <section class="flex flex-col gap-y-1">
              <h4 class="text-sm uppercase font-bold text-blue-primary mb-4">
                Community
              </h4>
              <a
                class="text-gray-800"
                href="https://discord.gg/r6AvtnU"
              >
                Discord
              </a>
              <a
                class="text-gray-800"
                href="https://github.com/thefrontside/interactors"
              >
                GitHub
              </a>
            </section>
            <p class="md:col-span-3 text-blue-primary text-xs">
              Copyright &copy; 2019 - {new Date().getFullYear()}{" "}
              The Frontside Software, Inc.
            </p>
          </footer>
        </body>
      </html>
    );
  };
}
