# Vendored Configliere

`configliere.js` and `configliere-types/` are a runtime bundle and its type
declarations from Configliere's experimental positional arguments branch:

- pull request: <https://github.com/thefrontside/configliere/pull/27>
- source commit: `7ea47ca0e3026356285f3f6f4b95f24d3a4ff7b7`
- source license: MIT; see `configliere.LICENSE.md`

It was generated from a clean checkout of that commit with Deno 2.9.4:

```console
deno bundle --format esm --platform deno --output configliere.js mod.ts
```

The declarations were copied from the ESM build in the PR's
`configliere@27` preview package (`0.4.0-pr+c35f928a6dfb7219823fe1f24f0a8708904c1083`).
They retain Configliere's compile-time route and model inference while the CLI
executes the single-file runtime bundle. Their internal JavaScript specifiers
were rewritten to declaration-file specifiers because only the type half of
that ESM build is vendored.

The bundle is checked in so the CLI does not depend on an unpublished preview
package at install or runtime. Regenerate it from the pinned commit when
updating Configliere, then restore the provenance header at the top of the
generated file.
