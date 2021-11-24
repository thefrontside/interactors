---
id: create-actions
title: Adding actions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

We have already seen actions on other interactors, let's see how we can define
our own.

Basically, actions are just async functions which take the interactor as an
argument. Let's define an action on our datepicker which fills in the text
field:

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend('datepicker')
    .selector('.datepicker')
    .actions({
      async fillIn(datePicker, value) {
        await datePicker.find(TextField()).fillIn(value);
      }
    });
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend<HTMLDivElement>('datepicker')
    .selector('.datepicker')
    .actions({
      async fillIn(datePicker, value: string) {
        await datePicker.find(TextField()).fillIn(value);
      }
    });
  ```

  </TabItem>
</Tabs>

Normally you will want to compose actions out of other actions. The HTML
interactors provide most of the interactions you need to interact with most
web applications. However, let's look at how we could use `perform`
to implement a custom action which works with elements directly:

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend('datepicker')
    .selector('.datepicker')
    .actions({
      async submit(interactor) {
        await interactor.closest('form').submit();
      }
    });
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend<HTMLDivElement>('datepicker')
    .selector('.datepicker')
    .actions({
      async submit(interactor) {
        await interactor.closest('form').submit();
      }
    });
  ```

  </TabItem>
</Tabs>

:::tip
Having to use `perform` might indicate that the accessibility of your
application can be improved. An accessible application is also usually easier
to test.
::
