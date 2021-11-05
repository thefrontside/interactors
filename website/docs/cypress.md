---
id: cypress
title: Cypress
---

Interactors fit right in with Cypress as well, though as we explain below you may need some slight configuration for ES Modules and TypeScript. In order to get started with interactors, you will need to install `@interactors/with-cypress` and import it to your [Cypress support file](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Support-file):

```js
// cypress/support/index.js
import '@interactors/with-cypress';
```

Importing `@interactors/with-cypress` will automatically register the `cy.do()` and `cy.expect()` commands for interactions and assertions respectively. In the following example, we demonstrate how to to use `cy.do()` and `cy.expect()` in a Cypress test together with `@interactors/html`:

```js
import { Button } from '@interactors/html';

describe('Interactors with Cypress', () => {
  beforeEach(() => cy.visit('/'));

  it('clicks button', () => {
    cy.do(
      Button('Sign In').click()
    );
    cy.expect([
      Button('Sign In').absent(),
      Button('Log Out').exists()
    ]);
  });
});
```

The `cy.do()` and `cy.expect()` commands can take either a single interaction or an array of interactions.

### ES Modules

To use `import` and `export` in your tests, your project needs to support [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). You may already have this set up, but if you do not you may see a warning like this if you try to `import` anything in your test:

> ParseError: 'import' and 'export' may appear only with 'sourceType: module'

Follow [these steps](https://github.com/cypress-io/cypress/tree/master/npm/webpack-preprocessor#cypress-webpack-preprocessor) to get ES Modules working.

### TypeScript

TypeScript users should make sure to add `cypress` to the types array in `tsconfig`:
```
{
  "compilerOptions: {
    "types": ["cypress"]
  }
}
```
See Cypress' guide on [TypeScript support](https://docs.cypress.io/guides/tooling/typescript-support.html#Configure-tsconfig-json) for more details.
