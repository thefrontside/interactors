# Changelog

## 4.1.0

### Minor Changes

- 10639b8: Add filter methods which return the current value of a filter

### Patch Changes

- 9725501: Add ts-docs for material-ui interactors
- dcf14c7: Enhance NPM READMEs to point to interactor website
- 3c0aa1c: Added API typedocs
- Updated dependencies [cdbc904]
- Updated dependencies [1f551e9]
- Updated dependencies [e95ab99]
- Updated dependencies [10639b8]
- Updated dependencies [020595c]
- Updated dependencies [6834dcf]
- Updated dependencies [dcf14c7]
- Updated dependencies [85ef221]
- Updated dependencies [e3448b0]
- Updated dependencies [9f79e84]
- Updated dependencies [3c0aa1c]
- Updated dependencies [2f5aa35]
  - @interactors/html@0.34.0

## 4.0.0

### Minor Changes

- 1b04681: Use `@testing-library/user-event` to emulate user clicks

### Patch Changes

- cacf81e: Fix `@interactors/html` monorepo reference
- 2ff412b: Allow set document resolver for interactors and decouple it from `@bigtest/globals`
- 029c42f: Publish new package name for material-ui interactors
- Updated dependencies [8cc06bb]
- Updated dependencies [1b04681]
- Updated dependencies [2ff412b]
- Updated dependencies [c628b63]
  - @interactors/html@0.33.0

## 4.0.0-alpha.3

### Minor Changes

- eee44a7: Change package name to @interactors/material-ui

## \[4.0.0-alpha.2]

- Added interactor for [Button](https://material-ui.com/components/buttons/) component
  - [3279a09](https://github.com/thefrontside/material-ui-interactors/commit/3279a09785353fd13756b270f2160955c4cd80ab) improve button interactor, refactor to use render helper on 2021-06-23
- Fix finding components by class attribute selector to ignore theme postfix
  - [aba4a84](https://github.com/thefrontside/material-ui-interactors/commit/aba4a8481adb9c9582241a22d3d089c85168de8f) fix finding components with custom theme on 2021-06-17
- Rearrange the deps and devDeps. Fix [#13](https://github.com/thefrontside/material-ui-interactors/issues/13)
  Fix prepack build
  - [ba17868](https://github.com/thefrontside/material-ui-interactors/commit/ba178689e35055259b4aee3d2482cbf46575cd4c) Rearrange the deps and devDeps on 2021-05-17
  - [b4fa711](https://github.com/thefrontside/material-ui-interactors/commit/b4fa71173e007f06e70b31ee6be901fd09fa2aec) move bigtest to the devDeps on 2021-05-18
- Fix import `HTML` interactor from `@bigtest/interactor` instead of `bigtest`
  - [425bb02](https://github.com/thefrontside/material-ui-interactors/commit/425bb02e6cdb1ec666e3148aac4ad47abfd0f9f9) add changes description on 2021-06-17
  - [97732cb](https://github.com/thefrontside/material-ui-interactors/commit/97732cb925c10d49858c65f48ebaa09599f9866c) Update .changes/fix-html-import.md on 2021-06-17
- Added interactor for [List](https://material-ui.com/components/list/) component
  - [0366a25](https://github.com/thefrontside/material-ui-interactors/commit/0366a2580ff6a6ee28cb3d58fd69473e5b148d06) add list interactor on 2021-06-21
- Added interactor for [Popover](https://material-ui.com/components/popover/) component
  Export `SelectOption` interactor
  - [413d5ae](https://github.com/thefrontside/material-ui-interactors/commit/413d5ae1a12f3db3b02b3c0ee83067cb016dd7e5) add popover interactor on 2021-06-21
- Added interactor for [Radio](https://material-ui.com/components/radio/) component
  - [58474c3](https://github.com/thefrontside/material-ui-interactors/commit/58474c3ee7e5a97965940f1d4a509654a7e43c8a) Add changeset on 2021-06-02
- Added interactors for [Slider](https://material-ui.com/components/slider/) component
  - [b43e08b](https://github.com/thefrontside/material-ui-interactors/commit/b43e08b54e74472e70786d07c741ceb9e13a53f9) implement Slider interactor on 2021-06-30

## \[4.0.0-alpha.1]

- Added interactor for [Accordion](https://material-ui.com/components/accordion/) component
  - [6df871f](https://github.com/thefrontside/material-ui-interactors/commit/6df871fec996cc109537db05ddfd726bb04e45fe) refactor(accordion): extend from HTML and remove unnecessary interactors on 2021-05-06
  - [2c78824](https://github.com/thefrontside/material-ui-interactors/commit/2c78824fadd832f636c8e9f4e4248b252ba34c71) refactor: add `applyGetter` helper on 2021-05-07
- Added interactor for [BottomNavigation](https://material-ui.com/components/bottom-navigation/) component
  - [15aa49a](https://github.com/thefrontside/material-ui-interactors/commit/15aa49a64a8fdbbf6d11d7fb712140a51dddab1b) refactor(bottom-navigation): rename action to `navigate` on 2021-05-06
  - [b0e2411](https://github.com/thefrontside/material-ui-interactors/commit/b0e2411195130a4c595c26f28ea980d42fe5ffba) docs: fix chande md files on 2021-05-06
  - [a70acee](https://github.com/thefrontside/material-ui-interactors/commit/a70acee696782e725a704227bf4ef6631fd7be26) Fix change files and typos on 2021-05-06
- Added interactor for [Link](https://material-ui.com/components/links/) component
  - [f654038](https://github.com/thefrontside/material-ui-interactors/commit/f6540381de2371580d28510c58f52614c81de851) docs: add PR changes description on 2021-05-06
  - [b0e2411](https://github.com/thefrontside/material-ui-interactors/commit/b0e2411195130a4c595c26f28ea980d42fe5ffba) docs: fix chande md files on 2021-05-06
  - [a70acee](https://github.com/thefrontside/material-ui-interactors/commit/a70acee696782e725a704227bf4ef6631fd7be26) Fix change files and typos on 2021-05-06
- Added interactor for [Menu](https://material-ui.com/components/menus/) component
  - [da053ef](https://github.com/thefrontside/material-ui-interactors/commit/da053ef91130fc168468acf92944d740461de151) docs: add PR changes description on 2021-05-06
  - [fd986a3](https://github.com/thefrontside/material-ui-interactors/commit/fd986a31bb80dc7c2b57a64f0bdd391b871ebc7e) docs: fix chande md files on 2021-05-06
  - [a70acee](https://github.com/thefrontside/material-ui-interactors/commit/a70acee696782e725a704227bf4ef6631fd7be26) Fix change files and typos on 2021-05-06
- Added interactors for [Select](https://material-ui.com/components/selects/) component
  - [be0d6d1](https://github.com/thefrontside/material-ui-interactors/commit/be0d6d10283f3fab229838041bb5217076272baf) docs: add PR changes description on 2021-05-06
  - [d10c97c](https://github.com/thefrontside/material-ui-interactors/commit/d10c97cfdd01b7f456078fe50bb8dc3707023ac4) docs: fix change md file on 2021-05-07
- Added interactor for [Switch](https://material-ui.com/components/switches/) component
  - [798984f](https://github.com/thefrontside/material-ui-interactors/commit/798984fb1a01198684ba229272150cf16e66c0a5) docs: add PR changes description on 2021-05-06
  - [b0e2411](https://github.com/thefrontside/material-ui-interactors/commit/b0e2411195130a4c595c26f28ea980d42fe5ffba) docs: fix chande md files on 2021-05-06
  - [a70acee](https://github.com/thefrontside/material-ui-interactors/commit/a70acee696782e725a704227bf4ef6631fd7be26) Fix change files and typos on 2021-05-06
- Added interactor for [Tab](https://material-ui.com/components/tabs/) component
  - [25cca81](https://github.com/thefrontside/material-ui-interactors/commit/25cca810587a175b48f0c596dd1ae49ba3c58580) docs: add PR changes description on 2021-05-06
  - [a4358f1](https://github.com/thefrontside/material-ui-interactors/commit/a4358f1d18c0d4c669bba9a5d5d8b66113f108e6) docs: fix change md file on 2021-05-07
- Added interactor for [TextField](https://material-ui.com/components/text-fields/) component
  - [52d7d9b](https://github.com/thefrontside/material-ui-interactors/commit/52d7d9b2fd7c9f524a1a9a0ebcf99e7e63ca0f07) docs: add PR changes description on 2021-05-06
  - [2969fc9](https://github.com/thefrontside/material-ui-interactors/commit/2969fc97409de33f4fd98d3ea151a89917af8c7b) feat(select): add `description` filter on 2021-05-07

## \[4.0.0-alpha.0]

- initial release of v4 alpha
  - [8360cf2](https://github.com/thefrontside/material-ui-interactors/commit/8360cf2936be6722942aa667bba9807f06049922) Setup prerelease mode on 2021-04-23
