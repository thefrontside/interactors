---
id: create-locator
title: Defining the locator
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Depending on what the markup that our interactor works with looks like, there might be many
ways to locate a specific instance of that interactor. The locator defines the default way of
how your interactor locates a specific element.

For example, there might be many datepickers on our page, but we specifically want to use the
one that selects the Birthday.

:::tip
One of the philosophies of interactors is to test your application the way a
user sees it, so the locator should normally be something that the user knows
about, which is visible in the interface, like the label of a button, not
something which is only relevant in the markup, such as the button's `id`.
:::

## Locator function

As you may recall, our datepicker has a `title` attribute which shows the name of the datepicker:

```html
<div id="birthday-picker" class="datepicker" title="Birthday">
  ...
</div>
```

Let's use this `title` as our locator!

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend('datepicker')
    .selector('.datepicker');
    .locator((element) => element.title);
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend<HTMLDivElement>('datepicker')
    .selector('.datepicker');
    .locator((element) => element.title);
  ```

  </TabItem>
</Tabs>

You may be noticing that our locator is a function which takes an element and
then just *returns* a value. When we look for a specific date picker, and
provide a locator value such as 'Birthday', the value we returned will be
compared to the provided value. Inside of the locator function you do not have
access to the value that we're actually searching for! This is intentional, as
it enables us to provide much better error messages in case the element cannot
be found.

We can now use our locator to find a specific datepicker:

```js
await DatePicker('Birthday')
  .find(TextField('Birthday'))
  .fillIn('1986-04-12');
```

## Delegation

While using the `title` to locate the date picker is perfectly fine, it would
be even nicer if we could use the label of the text field that the datepicker
contains.  This way we don't have to rely on the title attribute being
available.

```html
<div id="birthday-picker" class="datepicker">
  <label for="birthday-field">Birthday</label>
  <input id="birthday-field" type="text"/>

  <div class="calendar closed">
    ...
  </div>
</div>
```

In our locator we can use the full DOM API to fetch any value we want, so we can
do something like the following:

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend('datepicker')
    .selector('.datepicker');
    .locator((element) => {
      let label = element.querySelector('label');
      return label ? label.textContent : "";
    });
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend<HTMLDivElement>('datepicker')
    .selector('.datepicker');
    .locator((element) => {
      let label = element.querySelector('label');
      return label ? label.textContent : "";
    });
  ```

  </TabItem>
</Tabs>

Of course, the best would be to be able to use the `TextField` interactor in our
locator. Such a feature is planned, but not implemented [yet][].

[yet]: https://github.com/thefrontside/interactors/issues/102
