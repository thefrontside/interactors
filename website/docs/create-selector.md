---
id: create-selector
title: Defining the selector
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Interactors need a way to find the elements that they operate on. The selector
is used to find all elements which the interactor can operate on. If we want to
find a specific element to interact with, we can then use the locator and filters
to narrow down our selection.

For example, the `Select` interactor can operate on all `select` tags, and so
its selector is the CSS selector `select`.

Our datepicker uses a `div` tag, since there is no HTML element specific for
date pickers. But the `div` has a `datepicker` class. Let's use this class as
our selector:

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend('datepicker')
    .selector('.datepicker');
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend<HTMLDivElement>('datepicker')
    .selector('.datepicker');
  ```

  </TabItem>
</Tabs>

Our interactor already is somewhat useful. For example, we could compose it
with other interactors to limit actions to within the datepicker!

```js
await DatePicker().find(TextField('Birthday')).fillIn('1986-04-12');
```

We can use `DatePicker()` if there is only one datepicker on the page, but
normally we want to be more specific about which specific datepicker we want to
use. That is the purpose of the [locator](/docs/create-locator).

:::note TypeScript
The type of the Element that you specify when creating the interactor should
match the type of the elements returned by the selector.
:::

## Selector function

Most of the time, a CSS selector works fine as the selector, but there are some
rare cases where you might want to use a different way of specifying how to
select the elements. `selector` can also take a function, which takes as its argument
the parent element, and returns an array of elements:

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend('datepicker')
    .selector((parent) => Array.from(parent.querySelectorAll('.datepicker')));
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend<HTMLDivElement>('datepicker')
    .selector((parent) => Array.from(parent.querySelectorAll('.datepicker')));
  ```

  </TabItem>
</Tabs>
