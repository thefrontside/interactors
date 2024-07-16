# @interactors/html

## 1.0.0

### Major Changes

- 85da2e8: Release 1.0 RC1

### Patch Changes

- e156093: Lookup Interactor by ARIA label if it is present
- 5386ccc: Update TypeScript to v5.4
- d859e16: Pin versions for internal @interactors/\* dependencies
  Remove `@interactors/html` re-export from `with-cypress` package
- Updated dependencies [e111228]
- Updated dependencies [27c4059]
- Updated dependencies [efecf56]
- Updated dependencies [596dee1]
- Updated dependencies [57b2a27]
- Updated dependencies [5386ccc]
- Updated dependencies [5936572]
- Updated dependencies [a3155cf]
- Updated dependencies [968109e]
- Updated dependencies [afcf87b]
- Updated dependencies [85da2e8]
- Updated dependencies [d859e16]
- Updated dependencies [4538b92]
  - @interactors/keyboard@1.0.0
  - @interactors/core@1.0.0

## 1.0.0-rc1.6

### Patch Changes

- e156093: Lookup Interactor by ARIA label if it is present
- 5386ccc: Update TypeScript to v5.4
- Updated dependencies [5386ccc]
  - @interactors/core@1.0.0-rc1.6
  - @interactors/keyboard@1.0.0-rc1.6

## 1.0.0-rc1.5

### Patch Changes

- Updated dependencies [5936572]
  - @interactors/core@1.0.0-rc1.5
  - @interactors/keyboard@1.0.0-rc1.5

## 1.0.0-rc1.4

### Patch Changes

- Updated dependencies [596dee1]
  - @interactors/core@1.0.0-rc1.4
  - @interactors/keyboard@1.0.0-rc1.4

## 1.0.0-rc1.3

### Patch Changes

- Updated dependencies [efecf56]
- Updated dependencies [a3155cf]
- Updated dependencies [968109e]
- Updated dependencies [afcf87b]
  - @interactors/core@1.0.0-rc1.3
  - @interactors/keyboard@1.0.0-rc1.3

## 1.0.0-rc1.2

### Patch Changes

- Updated dependencies [27c4059]
  - @interactors/core@1.0.0-rc1.2
  - @interactors/keyboard@1.0.0-rc1.2

## 1.0.0-rc1.1

### Patch Changes

- d859e16: Pin versions for internal @interactors/\* dependencies
  Remove `@interactors/html` re-export from `with-cypress` package
- Updated dependencies [e111228]
- Updated dependencies [57b2a27]
- Updated dependencies [d859e16]
- Updated dependencies [4538b92]
  - @interactors/keyboard@1.0.0-rc1.1
  - @interactors/core@1.0.0-rc1.1

## 1.0.0-rc1.0

### Major Changes

- dfcbf1a: Release 1.0 RC1

### Patch Changes

- Updated dependencies [dfcbf1a]
  - @interactors/core@1.0.0-rc1.0
  - @interactors/keyboard@1.0.0-rc1.0

## 0.37.0

### Minor Changes

- 891af02: Add keyboard interactor
- 76215cc: Remove deprecated functionality

### Patch Changes

- 53f1980: make className filter returns string for svg elements
- Updated dependencies [76215cc]
- Updated dependencies [f06c7fe]
- Updated dependencies [960da4e]
  - @interactors/core@0.4.0
  - @interactors/keyboard@0.1.1

## 0.36.0

### Minor Changes

- af252a3: Use locator delegation for html interactors

### Patch Changes

- Updated dependencies [53dea63]
  - @interactors/core@0.3.0

## 0.35.0

### Minor Changes

- 3648853: Remove deprecated app interactor
- 47f1478: Split off core into own package
- 735b68d: Add Details interactor
- 80b72fe: Add FieldSet interactor
- 31367d7: Reexport innerText function

### Patch Changes

- Updated dependencies [0c96dab]
- Updated dependencies [f4949ac]
  - @interactors/core@0.2.0

## 0.34.0

### Minor Changes

- cdbc904: Add `@interactors/globals` package. Decouple interactors from `@bigtest/globals`
- e95ab99: Add filter delegation
- 10639b8: Add filter methods which return the current value of a filter
- 020595c: Remove deprecated matchers
- 9f79e84: Remove interactor specification interface

### Patch Changes

- 1f551e9: call action from interaction context
- 6834dcf: fix using destructured interactor actions
- dcf14c7: Enhance NPM READMEs to point to interactor website
- 85ef221: wrap interaction actions instead the whole interaction
- e3448b0: Fix copy-pasted ts-docs of html interactors
- 3c0aa1c: Added API typedocs
- 2f5aa35: fix missing fallback file for testing library
- Updated dependencies [cdbc904]
- Updated dependencies [85ef221]
  - @interactors/globals@0.1.0

## 0.33.0

### Minor Changes

- 1b04681: Use `@testing-library/user-event` to emulate user clicks

### Patch Changes

- 8cc06bb: Fix the Cypress error with trying set readonly property of custom errors.
- 2ff412b: Allow set document resolver for interactors and decouple it from `@bigtest/globals`
- c628b63: Swap out performance ponyfill

## 0.32.0

### Minor Changes

- fd6375a: Improve build configuration

### Patch Changes

- e2a6d11: Allow use a regular expression (in addition to locator string and filter) as a primary method for looking up an interactor. E.g. `Button(/submit/i)`

## 0.31.3

### Patch Changes

- 7caff9c: Update repository location

## 0.31.2

### Patch Changes

- 799644e2: Rename @bigtest/interactor package to @interactors/html

## 0.31.1

### Patch Changes

- 0bf23644: Add `isInteraction` type guard to identify interaction object

## 0.31.0

### Minor Changes

- 7089b975: Override filters appearing in lookup to the assertion filters (fix [#966](https://github.com/thefrontside/bigtest/issues/966))

## 0.30.0

### Minor Changes

- 03cfbb11: Change `HTML` interactor selector to not match any SVG elements
- 3dc81a09: Add ability to return value from `perform`
- 5159aa40: `Page` interactor reloads page on url hash changes (fix [#936](https://github.com/thefrontside/bigtest/issues/936))

## 0.29.0

### Minor Changes

- 448c034d: Deprecate matchers' format() for description()
- 6d69281a: Add `read` function to simplify getting values from element by using filter functions
- 0664aa51: Throw error if interactor is not given a label

### Patch Changes

- Updated dependencies [4762d0d9]
  - @bigtest/globals@0.7.6

## 0.28.2

### Patch Changes

- eae849da: Improved format for filter not matching error
- Updated dependencies [08b07d78]
  - @bigtest/globals@0.7.5

## 0.28.1

### Patch Changes

- 0ef3571e: Fix the `text` filter and `innerText` based locators so that they work
  out of the box with JSDOM

## 0.28.0

### Minor Changes

- a3d27f06: Use innerText for html interactors instead of textContent

## 0.27.0

### Minor Changes

- 1e22a72e: Deprecate focus, blur and focused helpers
- d12f2e6e: Add text, className and classList filters to html interactor

## 0.26.0

### Minor Changes

- a1d66276: Add built in matchers: includes, matches, and, or, not

## 0.25.0

### Minor Changes

- ad8e7468: Add HTML and FormField base interactors

## 0.24.0

### Minor Changes

- 42931105: Add `extend` method to interactor builder API, to downcast to a subtype of the element
- 0aed40e9: Extract cypress integration out of interactor as a standalone package
- ea04c546: Deprecate the `perform` function, use pattern matching instead!
- 052bf8f3: Add builder API for creating interactors
- ee5bf789: Add matchers to interactors, for more flexible matching

### Patch Changes

- 4d7c43f9: enable eslint rules from the latest @typescript-eslint/recommended
- 06f915b0: Refactor internals to remove Interactor class
- d85e5e95: upgrade eslint, typescript and @frontside packages
- Updated dependencies [4d7c43f9]
- Updated dependencies [d85e5e95]
  - @bigtest/globals@0.7.4

## 0.23.0

### Minor Changes

- 98c94312: `perform` will throw an error if run inside an assertion context
- 98c94312: Add `assertion` method to `Interactor`

### Patch Changes

- c1dd9d83: Extracts out the focus action and imports it into each interactor (and adds it to a few that were missing it).

## 0.22.0

### Minor Changes

- 4eae24b6: Add cypress integration for interactors
- 70f91954: Interactor actions are not automatically wrapped in a convergence

### Patch Changes

- c2c4bd11: Upgrade @frontside/typescript to v1.1.0
- Updated dependencies [c2c4bd11]
  - @bigtest/globals@0.7.3

## 0.21.0

### Minor Changes

- bb1234b8: Add Select interactor
- 4f7edbe1: Add `focused` filter to `Button`, `RadioButton`, `CheckBox`, `Link`,
  and `TextField` interactors
- a986ba26: Add MultiSelect interactor

### Patch Changes

- 1d525656: Add maximul column with for interactor alternative suggestion tables

## 0.20.0

### Minor Changes

- d12bbe7e: Add RadioButton interactor
- 09a28c69: TextField interactor now also matches textarea elements
- 64c8b12f: Rename App interactor to Page and deprecate App interactor
- 95698ac3: Page interactor can filter by title/url

### Patch Changes

- d5fa391e: Don't thread action type through filter, it is not necessary

## 0.19.0

### Minor Changes

- 98f99ba3: Add CheckBox interactor
- 0dfb3828: Interactor methds exists() and absent() are better behaved when it comes to ambiguity
- 3a9ff582: TextField interactor matches any input which is not a special input

### Patch Changes

- ca1cba60: Workaround the fact that React > 15.6 monkey-patches the
  HTMLInputElement `value` property as an optimization causing the
  `fillIn()` action not to work. See
  https://github.com/thefrontside/bigtest/issues/596
- a225fcda: Improve rendering of error table in interactors
  - @bigtest/globals@0.7.2

## 0.18.0

### Minor Changes

- e6cdf046: Add `Button` and `TextField` interactors
- 215f72ae: Remove support for custom locators
- 54707a71: Add visibility filter to interactors using element-is-visible
- 215f72ae: Filters can be passed to interactor even if locator is omitted, e.g. Button({ id: "foo" })
- 215f72ae: InteractorSpecification is a concrete type, parameterized over its actions and filters, rather than an interface, disallows incorrect options in interactor definition
- 215f72ae: Rename defaultLocator to locator

### Patch Changes

- 215f72ae: "did you mean" suggestions always render as a table, rather than an inline comma separated list
  - @bigtest/globals@0.7.1

## 0.17.0

### Minor Changes

- d97038a8: App interactor waits for application to load
- 7a727c86: Prevent interactor actions from being run in assertions

### Patch Changes

- Updated dependencies [d97038a8]
- Updated dependencies [7a727c86]
  - @bigtest/globals@0.7.0

## 0.16.1

### Patch Changes

- 502508c5: Update return type of Interactor#has to match Interactor#is.
  - @bigtest/globals@0.6.3

## 0.16.0

### Minor Changes

- ffd9be8b: Allow passing any fully-formed step into the `step()` method of the
  DSL. For example:

  ```ts
  .step({ description: 'visit /users', action: () => App.visit('/users')})
  ```

  Interactions implement this natively, so you can now use them
  directly:

  ```ts
  .step(App.visit('/users'))
  ```

- 48fde34e: Add built in interactors `Link` and `Heading`.
- 821991d6: Support nullary interactors for singleton elements:

  ```
  const MainNav = createInteractor('button')({
    selector: '#main-nav'
  });

  MainNav().click('Widgets');
  ```

### Patch Changes

- @bigtest/globals@0.6.2

## 0.15.1

### Patch Changes

- da5eeac7: Better error messages on ambiguous matches
- e8ebbe1e: Improve error messages generated by interactors and sometimes suggest alternatives
  - @bigtest/globals@0.6.1

## 0.15.0

### Minor Changes

- 845cc399: Interactor actions functions now receive the interactor, supporting composition of
  interactors within an action:

  ```
  const Datepicker = createInteractor<HTMLDivElement>("datepicker")({
    // ...
    actions: {
      toggle: async interactor => {
        await interactor.find(TextField.byPlaceholder("YYYY-MM-DD")).click();
      }
    }
  });
  ```

  The `resolve()` method on `Interactor` has been replaced with a `perform()` method:

  ```
  const Link = createInteractor<HTMLLinkElement>("link")({
    // ...
    actions: {
      click: async interactor => {
        await interactor.perform(element => element.click());
      }
    }
  });
  ```

  Or more simply with the new `perform()` helper function:

  ```
  import { createInteractor, perform } from "@bigtest/interactor";

  const Link = createInteractor<HTMLLinkElement>("link")({
    // ...
    actions: {
      click: perform(element => element.click())
    }
  });
  ```

## 0.14.0

### Minor Changes

- 4c695f0e: Drop resolve value from interactions and assertions. If the promise
  resolves, that means it was successful. in other words, the type of
  `exists()` is now `() => Promise<void>`, not `() => Promise<true>`

## 0.13.0

### Minor Changes

- 30647e65: Can filter interactors to narrow selection without having to define a separate interactor

## 0.12.1

### Patch Changes

- 05f42175: Interactor actions should forward arguments

## 0.12.0

### Minor Changes

- d62c4e2b: Add an app interactor which can be used to load the application into the test frame. Agent no longer loads app automatically.
- caddd0cb: Use @bigtest/globals for configuration, rather than own configuration mechanism.
- 2de1a7ab: Interactors are generically typed over the specification that they use.

### Patch Changes

- d1725678: Interactors did not properly type the defined interactors due to incorrectly applied type transformations.
- Updated dependencies [d62c4e2b]
- Updated dependencies [65b0156c]
  - @bigtest/globals@0.6.0

## 0.11.2

### Patch Changes

- f2ca496e: use @bigtest/performance to ponyfill performance apis
- 6b6c7450: bundle sources so that parcel can use them to generate bundle
  sourcemaps

## 0.11.1

### Patch Changes

- d2d50a5b: upgrade effection

## 0.11.0

### Minor Changes

- 154b93a1: Introduce changesets for simpler release management
