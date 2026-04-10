---
id: jest
title: Jest
---

When you use interactors in Jest, there are only a few things you need to know to fit them in with the tests you have already written.

First, interactors replace both user actions and test assertions. That means that you will not need `expect` anymore. For instance, instead of making an assertion as `expect(‘button’).toBeTruthy()`  you can use `await Button('Log Out’).exists()`. The example below illustrates how to use Interactors within Jest:

```js
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

import { Button } from '@interactors/html';

describe('Interactors with Jest', () => {
  beforeEach(() => render(<App />));

  it('clicks button', async () => {
    await Button('Sign In').click();
    await Button('Log Out').exists();
  });
});
```

If an interactor's assertion fails, the error will be received by Jest and you will see it in your test output.

Note that the interactors are asynchronous, and so you need to mark your test function as `async`, and you should `await` the interactors and their assertions.

:::info Events in JSDOM
JSDOM versions 15 and below do not have support for `InputEvent` on which interactors rely. If you are using one of these older versions, which unfortunately was the case for `create-react-app` prior to `v4.0.0`, you will need to make sure your tests are running in `JSDOM >= 16.0.0`.
:::
