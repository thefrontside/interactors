---
id: quick-start
title: Quick Start
slug: /
---

Interactors make writing your UI tests easier, faster, and more reliable. You can use them across many different testing frameworks.

By the end of this page you will be testing one of your own apps with Interactors.

:::note We're here to help
 If you need help or have questions along the way, please let us know in [the Discord chat](https://discord.gg/r6AvtnU) or [open a discussion](https://github.com/thefrontside/interactors/discussions/) on Github.
:::

## Prerequisites

- [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install)
- A web app*

\* To follow along with this tutorial, you need an app that uses [Jest](https://jestjs.io/), [Cypress](https://www.cypress.io/), or BigTest. For the most informative learning experience you should use one of your own apps. If you don’t have one available you can use the sample app below

### Sample app

Run the following command to install a sample project which includes a simple app with test suites implemented for Jest, Cypress, and BigTest:

```
npx interactors-sample
```

After you’ve installed the project, you’ll be able to run the test suite of your choice. For example, for running the Jest suite you can use `npm run test:jest`. More details are available in the welcome message for the project.

## Installation

If you're using your own app, install Interactors with the following command:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  groupId="package-manager"
  defaultValue="npm"
  values={[
    {label: 'NPM', value: 'npm'},
    {label: 'Yarn', value: 'yarn'}
]}>
  <TabItem value="npm">

  ```
  npm install @interactors/html --save-dev
  ```

  </TabItem>
  <TabItem value="yarn">

  ```
  yarn add @interactors/html --dev
  ```

  </TabItem>
</Tabs>

:::note Cypress
If you are using Cypress, you will also need to install `@interactors/with-cypress`:

<Tabs
  groupId="package-manager"
  defaultValue="npm"
  values={[
    {label: 'NPM', value: 'npm'},
    {label: 'Yarn', value: 'yarn'}
]}>
  <TabItem value="npm">

  ```
  npm install @interactors/html @interactors/with-cypress --save-dev
  ```

  </TabItem>
  <TabItem value="yarn">

  ```
  yarn add @interactors/html @interactors/with-cypress --dev
  ```

  </TabItem>
</Tabs>

Please refer to the [Cypress](/docs/cypress) guide for more details as there are additional setup steps.
:::

## Import Interactors in your test suite

Interactors can do a lot, but let's keep things simple for now and begin testing one of the most common user interactions - a button click.

Interactors have methods like `click` that mimic user actions. If you are using your own app, in your codebase find a test that already has a button click in it. In that test, import the `Button` interactor from `@interactors/html` and use it to replace the click interaction as exemplified below (make sure to substitute "Sign In" with your own button text):

<Tabs
  groupId="runner"
  defaultValue="jest"
  values={[
    {label: 'Jest', value: 'jest'},
    {label: 'Cypress', value: 'cypress'},
    {label: 'Bigtest', value: 'bigtest'}
]}>
  <TabItem value="jest">

  ```js
  import React from 'react';
  import { render } from '@testing-library/react';
  import App from './App';

  import { Button } from '@interactors/html';

  describe('Interactors with Jest', () => {
    beforeEach(() => render(<App />));

    it('clicks button', async () => {
      await Button('Sign In').click();
      // the rest of your test that was already written
    });
  });
  ```

  </TabItem>
  <TabItem value="cypress">

  ```js
  import { Button } from '@interactors/html';

  describe('Interactors with Cypress', () => {
    beforeEach(() => cy.visit('/'));

    it('clicks button', () => {
      cy.do(
        Button('Sign In').click();
      );
      // the rest of your test that was already written
    });
  });
  ```

  </TabItem>
  <TabItem value="bigtest">

  ```js
  import { test } from 'bigtest';
  import { Button, Page } from '@interactors/html';

  export default test('BigTest')
    .step(
      Page.visit('/'),
      Button('Sign In').click())
    .assertion(Button('Log out').exists());
  ```

  </TabItem>
</Tabs>

If you are using the sample project, you can find these examples inside `interactors-sample/src/test/` directory.

Now run your tests as you usually would or use any of the sample project options. Congratulations – you used your first Interactor!

:::note The BigTest Runner
BigTest can run your tests on any _real_ browser – just like your users use. We have built a new integrated platform from the ground up to help you test more with less effort. And best of all it's free and Open Source! [Check it out](https://frontside.com/bigtest), and let us know what you think.
:::

## Making test assertions

Interactors have methods to help you make test assertions, like checking if a Button is `absent` or if it `exists`.

Let’s build on top of the example you used in the last section. When a user clicks a button, _something_ is expected to happen. We want to check if that something does happen after we use an Interactor to click the button.

In the sample project, when you click the “Sign In” button it disappears and a “Sign out” button appears in its place. If you’re following along your own test suite, find a test that asserts whether an element exists. Writing this kind of assertion would look like this with Interactors:

<Tabs
  groupId="runner"
  defaultValue="jest"
  values={[
    {label: 'Jest', value: 'jest'},
    {label: 'Cypress', value: 'cypress'},
    {label: 'Bigtest', value: 'bigtest'}
]}>
  <TabItem value="jest">

  ```js
  describe('Interactors with Jest', () => {
    beforeEach(() => render(<App />));

    it('clicks button', async () => {
      await Button('Sign In').click();
      await Button('Sign In').absent();
      await Button('Log Out').exists();
    });
  });
  ```

  </TabItem>
  <TabItem value="cypress">

  ```js
  describe('Interactors with Cypress', () => {
    beforeEach(() => cy.visit('/'));

    it('clicks button', () => {
      cy.do(
        Button('Sign In').click()
      );
      cy.expect([
        Button('Sign In').absent(),
        Button('Log Out').exists(),
      ]);
    });
  });
  ```

  </TabItem>
  <TabItem value="bigtest">

  ```js
  import { test } from 'bigtest';
  import { Button, Page } from '@interactors/html';

  export default test('BigTest')
    .step(
      Page.visit('/'),
      Button('Sign In').click())
    .assertion(Button('Log out').exists());
  ```

  </TabItem>
</Tabs>

Now that you have the basics down it's time to see what Interactors can really do.

## A look at real-world interactors

What if testing a more complex UI was as straightforward as using that button interactor? In your past work, you might have experienced difficulties in testing date pickers, custom radio buttons, and modals – especially when you add in animations and async loading patterns. However, using interactors can make your tests simple, readable and reliable.

Here are examples of what a test for an airline datepicker interface could look like that use interactors:

<Tabs
  groupId="runner"
  defaultValue="jest"
  values={[
    {label: 'Jest', value: 'jest'},
    {label: 'Cypress', value: 'cypress'},
    {label: 'Bigtest', value: 'bigtest'}
]}>
  <TabItem value="jest">

  ```js
  import { Heading, RadioButton, TextField } from '@interactors/html';
  import { DatePicker, Modal } from './MyInteractors';

  describe('Interactors with Jest', () => {
    beforeEach(() => render(<App />));

    it('date picker for flights', async () => {
      await RadioButton('One-way').click();
      await TextField('FROM').fillIn('LAX');
      await TextField('TO').fillIn('YYZ');
      await DatePicker().select('June, 2022', '10'));
      await Modal({ id: 'loading' }).exists();
      await Heading('Departing flight').exists();
    });
  });
  ```

  </TabItem>
  <TabItem value="cypress">

  ```js
  import { Heading, RadioButton, TextField } from '@interactors/html';
  import { DatePicker, Modal } from './MyInteractors';

  describe('Interactors with Cypress', () => {
    beforeEach(() => cy.visit('/'));

    it('date picker for flights', () => {
      cy.do(
        RadioButton('One-way').click();
        TextField('FROM').fillIn('LAX');
        TextField('TO').fillIn('YYZ');
        DatePicker().select('June, 2022', '10'));
      );
      cy.expect(
        Modal({ id: 'loading' }).exists();
        Heading('Departing flight').exists();
      );
    });
  });
  ```

  </TabItem>
  <TabItem value="bigtest">

  ```js
  import { test } from 'bigtest';
  import { Heading, Page, RadioButton, TextField } from '@interactors/html';
  import { DatePicker, Modal } from './MyInteractors';

  export default test('BigTest')
    .step(
      Page.visit('/'),
      RadioButton('One-way').click(),
      TextField('FROM').fillIn('LAX'),
      TextField('TO').fillIn('YYZ'),
      DatePicker().select('June, 2022', '10')),
    .assertion(
      Modal({ id: 'loading' }).exists(),
      Heading('Departing flight').exists());
  ```

  </TabItem>
</Tabs>

As you can see, Interactors not only make it simple to use DOM elements like RadioButton and TextField, but they can also abstract away implementation details of other more complex components like DatePicker and Modal. We don’t need to know how the Modal works - we simply use it as a user would see it. That’s the power about Interactors: they simplify testing difficult interactions while being portable, making them ideal for design systems.

## Next steps

### Continue learning about Interactors

Try using more of the [HTML Interactors](/docs/predefined-interactors) within
your tests such as `Link`, `CheckBox`, `TextField`, and more. Check out the
[Libraries](/docs/library) to find interactors for the components you are
using.

Once you are comfortable with those, you’ll want to [write your own Interactors](/docs/create-first-interactor) to streamline the workflow of testing your own application.

### Join the Interactors community

If you want to know more about Interactors or have any questions, you can reach out to us on our Discord channel. We're eager to help you get started and hear your feedback on how to improve Interactors. [Join us today!](https://discord.gg/r6AvtnU)
