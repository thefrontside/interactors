---
id: create-first-interactor
title: Creating and extending
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

There are two ways of creating an interactor: starting from scratch, or
extending an existing interactor.

## Starting from scratch

In these guides we will slowly build up an interactor for a datepicker. The
markup for our datepicker looks like this:

```html
<div id="birthday-picker" class="datepicker" title="Birthday">
  <label for="birthday-field">Birthday</label>
  <input id="birthday-field" type="text"/>

  <div class="calendar closed">
    <h5 class="current-month">November 1985</h5>

    <ol>
      <li><button class="day">1</button></li>
      <li><button class="day">2</button></li>
      <li><button class="day">3</button></li>
      ...
      <li><button class="day">30</button></li>
    </ol>

    <button class="previous-month">Previous</button>
    <button class="next-month">Next</button>
  </div>
</div>
```

Let's start off by just creating an interactor for a datepicker without any
functionality. For this purpose we can use the `createInteractor` function:

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { createInteractor } from '@interactors/core';

  const DatePicker = createInteractor('datepicker')
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { createInteractor } from '@interactors/core';

  const DatePicker = createInteractor<HTMLDivElement>('datepicker')
  ```

  </TabItem>
</Tabs>

The argument to `createInteractor` is the name of the interactor, this will
appear in error messages and in some other places.

:::note TypeScript
Interactors work well with TypeScript, and they are completely typesafe. When
using TypeScript you'll want to specify the type of the element that your
interactors operate on. In this case, since our datepicker is using a `<div>`
element, we can specify the `HTMLDivElement` type as the element type. This
gives you access to any additional properties and methods that the element type
defines.
:::

## Extending an interactor

Another option for creating an interactor is to extend an existing interactor.
This interactor will inherit all of the properties of the interactor that is
being extended, including all of its filters and actions.

When you extend an interactor, you can modify all aspects of it, including the
selector, the locator and the interactor's filters and actions.

We can extend an interactor using the `extend` method. For our datepicker, it
might be a good idea to extend the `HTML` interactor from the
`@interactors/html` package. This interactor defines some filters and actions
which are useful for all HTML elements, for example an `id` filter, and a
`click` action.

If you're working with HTML elements, you will almost always want to extend the
`HTML` interactor, rather than using `createInteractor` directly. This is what
extending `HTML` looks like:

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend('datepicker');
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend<HTMLDivElement>('datepicker');
  ```

  </TabItem>
</Tabs>


This already makes our interactor more useful! We have inherited all of the
filters and actions from `HTML`, so we could use the `id` filter to locate a
specific datepicker!

```js
await DatePicker({ id: 'birthday-picker' })
  .find(TextField('Birthday'))
  .fillIn('1986-04-12');
```
