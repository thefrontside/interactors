import type { SitemapRoute } from "../plugins/sitemap.ts";
import type { JSXElement } from "revolution/jsx-runtime";

import { useAppHtml } from "./app.html.tsx";
import { useMarkdown } from "../hooks/use-markdown.tsx";

export function indexRoute(): SitemapRoute<JSXElement> {
  return {
    *routemap(generate) {
      return [{ pathname: generate() }];
    },
    handler: function* () {
      let codeExample = yield* useMarkdown(`\`\`\`js
it('subscribes to newsletter', async () => {
  await Input('email').fillIn('jorge@frontside.com');
  await Button('Subscribe').click();

  await Heading('Thanks!').exists();
});
\`\`\``);

      let AppHtml = yield* useAppHtml({
        title: "Interactors: page objects for component libraries",
        description:
          "Improve your UI testing experience and make maintenance easier. Interactors are composable page objects that work across Jest, Cypress, and more.",
      });

      return (
        <AppHtml>
          <article class="px-4 md:px-12 mb-16">
            <section class="grid grid-cols-1 md:grid-cols-2 md:gap-8 my-8 md:my-16 items-center">
              <hgroup>
                <h1 class="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">
                  <span class="bg-clip-text bg-gradient-to-r from-pink-accent to-purple text-transparent">
                    Interactors:
                  </span>
                  <br />
                  page objects for component libraries
                </h1>
                <p class="mt-4 text-lg text-gray-600">
                  Improve your UI testing experience and make maintenance easier
                  for yourself
                </p>
                <div class="mt-6">
                  <a
                    href="/docs/quick-start"
                    class="inline-block px-6 py-3 rounded-md font-bold text-white [background-image:linear-gradient(135deg,#f74d7b,#44378a_40%,#44378a_60%,#26abe8)] bg-[length:calc(100%+30px)] bg-[-5px] hover:bg-[-30px] transition-[background-position] duration-200"
                  >
                    Get Started
                  </a>
                </div>
              </hgroup>
              <div class="mt-8 md:mt-0">
                <div class="rounded-lg overflow-hidden shadow-lg text-sm [&_pre]:!m-0 [&_pre]:!rounded-lg">
                  {codeExample}
                </div>
              </div>
            </section>

            <section class="my-16">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 class="text-2xl font-extrabold uppercase tracking-tight mb-4">
                    Testing a UI should be as easy as building it
                  </h2>
                  <p class="text-gray-600 leading-relaxed">
                    Interactors allow design system maintainers to ship reusable
                    and simplified testing practices alongside their components.
                    Their users can start testing right away without figuring out
                    internal markup or selectors.
                  </p>
                </div>
                <div>
                  <img
                    src="/assets/images/design-systems.png"
                    alt="Design systems"
                    class="max-w-[15rem] mx-auto"
                  />
                </div>
              </div>
            </section>

            <section class="my-12 max-w-3xl mx-auto">
              <blockquote class="text-2xl text-center font-bold leading-relaxed">
                &ldquo;
                <strong>
                  Gone are the days of fragile, hard-coded selectors or
                  dependencies on mark-up structure in your consumers' test
                  cases
                </strong>
                &rdquo;
              </blockquote>
              <p class="mt-4 text-center text-lg text-gray-600">
                &mdash; John Coburn, Component Library Lead at FOLIO
              </p>
            </section>

            <section class="my-16">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div class="order-2 md:order-1">
                  <img
                    src="/assets/images/cross-platform.png"
                    alt="Cross platform"
                    class="max-w-[15rem] mx-auto"
                  />
                </div>
                <div class="order-1 md:order-2">
                  <h2 class="text-2xl font-extrabold uppercase tracking-tight mb-4">
                    Compatible with your test suite
                  </h2>
                  <p class="text-gray-600 leading-relaxed">
                    Interactors work out-of-the-box with your existing tests in
                    Jest, Cypress, BigTest, and more. You can add them in over
                    time to improve what you already have.
                  </p>
                </div>
              </div>
            </section>

            <section class="my-16">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 class="text-2xl font-extrabold uppercase tracking-tight mb-4">
                    UX &amp; a11y centric
                  </h2>
                  <p class="text-gray-600 leading-relaxed">
                    Nobody uses an app by searching{" "}
                    <code class="bg-gray-100 px-1 rounded text-sm">
                      [test-data-submit-button]
                    </code>{" "}
                    selectors: we read labels, click buttons, or navigate
                    through keystrokes. Interactors help you detect interaction
                    flaws such as ambiguity in the elements of your page or the
                    lack of adequate aria labels.
                  </p>
                </div>
                <div>
                  <img
                    src="/assets/images/ux-centric.png"
                    alt="UX centric"
                    class="max-w-[15rem] mx-auto"
                  />
                </div>
              </div>
            </section>

            <section class="my-16 max-w-[37rem] mx-auto">
              <h2 class="text-2xl font-extrabold uppercase tracking-tight mb-6">
                Why use Interactors?
              </h2>
              <div class="text-gray-600 leading-relaxed space-y-4">
                <p>
                  In many typical test suites, if you change something about one
                  button, you may have to change dozens of tests. It can take
                  more time to update the tests than to make the change in the
                  codebase.
                </p>
                <p>
                  Interactors were designed to help solve this problem and bring
                  your user interface tests closer to what users actually do.
                </p>
                <p>
                  A user finds something they want to interact with, takes
                  action, and gets a result. The code to accomplish these same
                  steps in a test is in one place as an Interactor. These
                  Interactors can then be reused in many different test
                  contexts.
                </p>
                <p>
                  Best of all, you do not need to throw out your existing tests
                  when you try out Interactors! They fit right in with the work
                  that you have already done.
                </p>
              </div>
              <div class="mt-8 text-center">
                <a
                  href="/docs/quick-start"
                  class="inline-block px-6 py-3 rounded-md font-bold text-white [background-image:linear-gradient(135deg,#f74d7b,#44378a_40%,#44378a_60%,#26abe8)] bg-[length:calc(100%+30px)] bg-[-5px] hover:bg-[-30px] transition-[background-position] duration-200"
                >
                  Try Interactors
                </a>
              </div>
            </section>
          </article>
        </AppHtml>
      );
    },
  };
}
