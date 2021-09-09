---
id: predefined-interactors
title: Predefined Interactors
---

Predefined interactors cover some of the most common UI testing needs for apps that run in the browser.

These are the default interactors that are offered in `@interactors/html`:

- [Button](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/button.ts)
- [CheckBox](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/check-box.ts)
- [FormField](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/form-field.ts)
- [Heading](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/heading.ts)
- [Link](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/link.ts)
- [MultiSelect](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/multi-select.ts)
- [Page](https://github.com/thefrontside/interactors/blob/main/packages/html/src/page.ts)
- [RadioButton](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/radio-button.ts)
- [Select](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/select.ts)
- [TextField](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/text-field.ts)

As you might have seen on the [Quick Start](/docs/) page, you can import any of the interactors directly from the `@interactors/html` package:

```js
import { Button, TextField } from '@interactors/html';
```

If your app has unique interfaces that are not covered by these built-in tools, you are encouraged to [write your own interactors](/docs/write-your-own). You can also check out [Existing Interactors](/docs/existing-interactors) to find out where you can see interactors written by other organizations.

### Page

The `Page` interactor is unique. Unlike the other predefined interactors, it's not designed to target one specific element but rather the whole page. It is useful for asserting for the url or title in your test environment:

```js
Page.has({ title: 'BigTest Example App' });
```
_The `Page` interactor is instantiated differently than the other predefined interactors so you do not need to call it `Page()` unless you want to pass in an argument._

:::note Heads up
We introduced `.exists()` and `.absent()` in the [Quick Start](/docs/) section but there are also `.has()` and `.is()` Interactor assertion methods. We will discuss their details on the [Assertions](/docs/assertions) page.
:::

And when using the BigTest runner, the Page interactor can be used to navigate between routes:

```js
import { test } from 'bigtest';
import { Page } from '@interactors/html';

export default test('BigTest Runner')
  .step(Page.visit('/contact'))
  .assertion(Page.has({ title: 'BigTest Example App'}));
```

## Up Next

What are the pieces that make up an interactor? Locators and filters help you find things in the UI and make assertions. Actions advance the state of your app. Keep reading on the [Locators, Filters, and Actions](/docs/locators-filters-actions) page to learn more.