import { Button, including, matching } from '@interactors/html';

describe('Cypress with Interactors', () => {
  beforeEach(() => {
    cy.visit('/');
  })
  it('single interactor per command', () => {
    cy
      .do(Button('SIGN IN').click())
      .expectThat(Button('LOG OUT').exists())
  });
  it('array of interactors', () => {
    cy
      .do([
        Button('SIGN IN').click(),
        Button('LOG OUT').click()
      ])
      .expectThat([
        Button('SIGN IN').exists(),
        Button('LOG OUT').absent()
      ]);
  });
  it('interactors with matchers', () => {
    cy
      .expectThat([
        Button(including('SIGN')).exists(),
        Button(matching(/SI(.*)IN/)).exists()
      ]);
  });
  it("cypress integration shouldn't break the built-in `should` assertion", () => {
    cy.wrap({ a: 1 }).should('eql', { a: 1 })
  });
});
