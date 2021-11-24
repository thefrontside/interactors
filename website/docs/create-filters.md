---
id: create-filters
title: Adding filters
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Our datepicker example from before contains a calendar which can be either open
or closed:

```html
<div id="birthday-picker" class="datepicker" title="Birthday">
  <label for="birthday-field">Birthday</label>
  <input id="birthday-field" type="text"/>

  <div class="calendar open">
    ...
  </div>
</div>
```

Let's start by creating an interactor for this calendar:

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { HTML } from '@interactors/html';

  const Calendar = HTML.extend('calendar')
    .selector('.calendar');
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { HTML } from '@interactors/html';

  const Calendar = HTML.extend<HTMLDivElement>('calendar')
    .selector('.calendar');
  ```

  </TabItem>
</Tabs>

We now want to define a filter on this interactor, which tells us whether the
calendar is open or closed:

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { HTML } from '@interactors/html';

  const Calendar = HTML.extend('calendar')
    .selector('.calendar')
    .filters({
      open: (element) => element.classList.has('open')
    });
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { HTML } from '@interactors/html';

  const Calendar = HTML.extend<HTMLDivElement>('calendar')
    .selector('.calendar')
    .filters({
      open: (element) => element.classList.has('open')
    });
  ```

  </TabItem>
</Tabs>

The filter is named `open` and it returns whether or not the element has the
`open` class applied to it. Just like with the locator function, our filter
returns the value for the given element.

Now that we've defined a filter, we can use it to both locate calendars, and
to make assertions about them. For example, we could check if our calendar is
open like this:

```js
await Calendar().is({ open: true });
```

## Default filters

As we saw when talking about [filters](/docs/locators-filters), filters can have a
default value. In the case of our calendar it might make sense to give the
`open` filter a default value of `true`. In most cases it should be required
that the calendar is open for us to interact with it. Let's add a default
filter like this:

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { HTML } from '@interactors/html';

  const Calendar = HTML.extend('calendar')
    .selector('.calendar')
    .filters({
      open: {
        apply: (element) => element.classList.has('open'),
        default: true
      }
    });
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { HTML } from '@interactors/html';

  const Calendar = HTML.extend<HTMLDivElement>('calendar')
    .selector('.calendar')
    .filters({
      open: {
        apply: (element) => element.classList.has('open'),
        default: true
      }
    });
  ```

  </TabItem>
</Tabs>

As you can see, the `open` filter now need to take an object, where the filter
function is specified in `apply` and the default value can be provided as well.

## Filter delegation

We have seen how to define a filter on our calendar to specify whether it is
open or not. But we want to also apply this filter to the entire datepicker. With
filter delegation, it is easy to reuse the filters of another interactor:

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend('datepicker')
    .selector('.datepicker')
    .locator((element) => {
      let label = element.querySelector('label');
      return label ? label.textContent : "";
    });
    .filters({
      open: Calendar().open()
    });
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend<HTMLDivElement>('datepicker')
    .selector('.datepicker')
    .locator((element) => {
      let label = element.querySelector('label');
      return label ? label.textContent : "";
    });
    .filters({
      open: Calendar().open()
    });
  ```

  </TabItem>
</Tabs>

We can now use our `open` filter on the datepicker as normal:

```js
await DatePicker('Birthday').is({ open: true });
```

Our datepicker interactor will locate the calendar within itself, and apply the
filter from the calendar interactor. We can also use `exists` and `absent` in the
same way:

<Tabs groupId="language">
  <TabItem value="javascript" label="JavaScript" default>

  ```js
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend('datepicker')
    .selector('.datepicker')
    .filters({
      hasCalendar: Calendar().exists()
    });
  ```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

  ```ts
  import { HTML } from '@interactors/html';

  const DatePicker = HTML.extend<HTMLDivElement>('datepicker')
    .selector('.datepicker')
    .filters({
      hasCalendar: Calendar().exists()
    });
  ```

  </TabItem>
</Tabs>

If you're observant, this might have you worried: doesn't `exists()` throw an
error when it fails, and aren't we creating an unhandled rejected promise here?
The trick to making this work is that all actions and assertions are *lazy*
promises, and they won't actually run or do anything until we await them for
the first time. This allows us to create what we call an "interaction" without
actually performing any actual work:

```js
// create the interaction, this doesn't do anything yet!
let interaction = Calendar().exists();

// only when we actually await the interaction do we start
// to check whether the calendar exists.
await interaction;
```
