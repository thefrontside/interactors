# `@interactors/playwright`

Load the three files produced by `interactors compile` into a Playwright page.
The Interactor implementation stays in the browser; tests call small typed
proxies in the Playwright process.

Compile the entrypoint that exports your Interactor definitions before starting
Playwright:

```console
$ interactors compile index.ts --outdir dist/
```

This writes `dist/agent.js`, `dist/interactors.json`, and
`dist/interactors.d.ts`.

```ts
import type * as Definitions from "../dist/interactors.d.ts";
import { loadInteractors } from "@interactors/playwright";

let { TextField, matching } = await loadInteractors<typeof Definitions>({
  page,
  directory: new URL("../dist/", import.meta.url),
});

await TextField("Email").fillIn("jonas@example.com");
await TextField(matching(/mail/i)).has({ value: "jonas@example.com" });
```

`loadInteractors()` reads and validates `interactors.json`, installs `agent.js`
in the current document and every future navigation, and verifies that the agent
has the same protocol version and registry hash. Each action and assertion is
then executed with `page.evaluate()`. The agent is installed in
the page's main frame; interacting with a child frame requires loading against a
frame-capable adapter in the future.

The generated declarations are type-only. Pass them to `loadInteractors()` as
shown above; do not import them at runtime. `RemoteDefinitions` removes the
definition-time builder methods and the callback-based `perform()` and
`assert()` methods because functions cannot cross the page boundary. It also
omits raw filter getter methods: assert filter values with `has()` or `is()` so
the Interactor retains its convergence and diagnostic behavior.

## Playwright Test fixture

```ts
import { test as base } from "@playwright/test";
import type * as Definitions from "../dist/interactors.d.ts";
import {
  loadInteractors,
  type RemoteDefinitions,
} from "@interactors/playwright";

type Fixtures = {
  interactors: RemoteDefinitions<typeof Definitions>;
};

export const test = base.extend<Fixtures>({
  interactors: async ({ page }, use) => {
    await use(
      await loadInteractors<typeof Definitions>({
        page,
        directory: new URL("../dist/", import.meta.url),
      }),
    );
  },
});
```

Constructor arguments, filters, matcher arguments, action arguments, and action
results retain the types inferred from the original Interactor entrypoint.
Command values must be JSON-shaped; regular expressions and remote matcher
values are also supported. Action results must be values that Playwright can
serialize back from `page.evaluate()`. The `$type` object key is reserved for
the adapter's wire protocol and is rejected in command values.

Call `loadInteractors()` once for each `Page` (including popup pages). The init
script keeps that page's agent installed across subsequent navigations.
