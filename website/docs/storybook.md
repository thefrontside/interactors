---
id: storybook
title: Storybook
---

Interactors not only make writing tests easier, it can also help you develop UI components. Since [`Storybook`](https://storybook.js.org/) 6.4 you will be able to write [`interactive stories`](https://storybook.js.org/blog/interactive-stories-beta/) and use Interactors for them.

This requires no additional setup. Just install `@interactors/html` to your project, and then you can use interactors in your stories immediately.

In the same way Interactors make tests more reliable and easier to read, it will also enhance your developer experience with Storybook.

Here is an example of how you would normally write a story:

```js
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

export const FormSignIn = {
  play: async () => {
    await userEvent.type(screen.getById('email'), 'homer@gmail.com');
    await userEvent.type(screen.getById('password'), 'donuts123');
    await userEvent.click(screen.getByText('Sign In'));
  }
};
```

And this is the same story but written with interactors:

```js
import { Button, TextField } from '@interactors/html';

export const FormSignIn = {
  play: async () => {
    await TextField('Email').fillIn('homer@gmail.com');
    await TextField('Password').fillIn('donuts123');
    await Button('Sign In').click();
  }
};
```

## Interaction testing

You can go further and use Interactors to write tests for your stories in Storybook with [interaction testing](https://storybook.js.org/blog/interaction-testing-with-storybook/) feature.

To use it install `@storybook/addon-interactions` and `@interactors/with-storybook` storybook addons. Add them to your storybook config and enable interactions debugger feature:

```js
// .storybook/main.js
module.exports = {
  addons: ['@storybook/addon-interactions', '@interactors/with-storybook']
  features: { interactionsDebugger: true },
};
```

Then you are able to extend previous example by adding `Heading('Welcome Homer!').exists()` assertion


```js
import { Button, Heading, TextField } from '@interactors/html';

export const FormSignIn = {
  play: async () => {
    await TextField('Email').fillIn('homer@gmail.com');
    await TextField('Password').fillIn('donuts123');
    await Button('Sign In').click();
    await Heading('Welcome Homer!').exists();
  }
};
```

## Up Next

On this page we have gone over how Interactors can enhance your experience with Storybook. If you use `Material UI` to design your apps, you will be pleased to know that `Material UI` too can be used with Interactors and Storybook.

So go on over to the next page where we will share with you some of the notable existing interactors written for other projects and libraries.
