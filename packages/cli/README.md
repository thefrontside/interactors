# `@interactors/cli`

Compile an Interactor entrypoint into artifacts that a browser test runner can
load:

```console
$ npm install --save-dev @interactors/cli@alpha
```

```console
$ interactors compile index.ts --outdir dist
created dist/agent.js
created dist/interactors.json
created dist/interactors.d.ts
```

The entrypoint exports the interactor constructors that form the public test
API. It may also export custom matchers created with `createMatcher`.
Interactors and custom matchers must be named exports. Compilation evaluates the
entrypoint, so it should contain definitions rather than application startup
code or other side effects. Treat the entrypoint as trusted project code: it
runs with the compiler process's permissions.

- `agent.js` is a self-contained browser script.
- `interactors.json` is the versioned registry consumed by test-runner adapters.
- `interactors.d.ts` preserves the entrypoint's inferred constructor, filter,
  action, and custom matcher types without depending on its source files.

`interactors.d.ts` is type-only. A test-runner adapter imports it with
`import type` and implements matching remote proxies from `interactors.json`;
there is intentionally no runner-side `interactors.js` artifact.

All three artifacts carry the same SHA-256 registry hash. An adapter must check
that hash and the protocol version before sending a command to the agent.
Commands support JSON-shaped values plus encoded regular expressions and
matchers. Action results and filter values must be serializable by the test
runner's page bridge.

The compiler rejects browser bundles that retain external runtime dependencies.
The only exception is `events`, which is supplied by the generated agent for the
legacy Effection runtime.

## Programmatic API

```ts
import { compile } from "@interactors/cli";

await compile({
  entrypoint: "index.ts",
  outdir: "dist",
});
```

The npm package contains a standard JavaScript module and executable that run
under either Node or Deno. The compiler uses esbuild to load TypeScript and
create the browser agent, and the TypeScript compiler API to emit declarations.
Running it under Node does not require Deno to be installed, and running it
under Deno does not require Node to be installed.
