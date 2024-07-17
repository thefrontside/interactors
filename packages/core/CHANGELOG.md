# @interactors/core

## 1.0.0

### Major Changes

- 85da2e8: Release 1.0 RC1

### Minor Changes

- a3155cf: Store interactor name and interaction arguments for reflection
- 968109e: Use effection for converge and interactions

### Patch Changes

- 27c4059: Make filter and action methods available in actions
- efecf56: Improve filter matching and reduce unnecessary calls
- 596dee1: bump @testing-library/dom to v8.18.1 fixes https://github.com/thefrontside/interactors/issues/212
- 57b2a27: wait for element resolving in filter methods
- 5386ccc: Update TypeScript to v5.4
- 5936572: Fix type checking
- afcf87b: Add code representation for interactions
- d859e16: Pin versions for internal @interactors/\* dependencies
  Remove `@interactors/html` re-export from `with-cypress` package
- 4538b92: Matchers can return their code representation
- Updated dependencies [5386ccc]
- Updated dependencies [a3155cf]
- Updated dependencies [968109e]
- Updated dependencies [afcf87b]
- Updated dependencies [85da2e8]
- Updated dependencies [d859e16]
  - @interactors/globals@1.0.0

## 1.0.0-rc1.6

### Patch Changes

- 5386ccc: Update TypeScript to v5.4
- Updated dependencies [5386ccc]
  - @interactors/globals@1.0.0-rc1.3

## 1.0.0-rc1.5

### Patch Changes

- 5936572: Fix type checking

## 1.0.0-rc1.4

### Patch Changes

- 596dee1: bump @testing-library/dom to v8.18.1 fixes https://github.com/thefrontside/interactors/issues/212

## 1.0.0-rc1.3

### Minor Changes

- a3155cf: Store interactor name and interaction arguments for reflection
- 968109e: Use effection for converge and interactions

### Patch Changes

- efecf56: Improve filter matching and reduce unnecessary calls
- afcf87b: Add code representation for interactions
- Updated dependencies [a3155cf]
- Updated dependencies [968109e]
- Updated dependencies [afcf87b]
  - @interactors/globals@1.0.0-rc1.2

## 1.0.0-rc1.2

### Patch Changes

- 27c4059: Make filter and action methods available in actions

## 1.0.0-rc1.1

### Patch Changes

- 57b2a27: wait for element resolving in filter methods
- d859e16: Pin versions for internal @interactors/\* dependencies
  Remove `@interactors/html` re-export from `with-cypress` package
- 4538b92: Matchers can return their code representation
- Updated dependencies [d859e16]
  - @interactors/globals@1.0.0-rc1.1

## 1.0.0-rc1.0

### Major Changes

- dfcbf1a: Release 1.0 RC1

### Patch Changes

- Updated dependencies [dfcbf1a]
  - @interactors/globals@1.0.0-rc1.0

## 0.4.0

### Minor Changes

- 76215cc: Remove deprecated functionality

### Patch Changes

- f06c7fe: simplify interactor instatiate function
- 960da4e: Remove the ExistsAssertionsImplementation since it is no longer necessary
- Updated dependencies [891af02]
  - @interactors/globals@0.2.0

## 0.3.0

### Minor Changes

- 53dea63: Enable delegation to locator of an interactor if no filter given

## 0.2.0

### Minor Changes

- 0c96dab: Add locator delegation. Locators can be delegated to another delegator.
- f4949ac: Selector can be a function to return arbitrary elements
