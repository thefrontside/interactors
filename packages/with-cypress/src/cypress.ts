/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
import { Interaction, isInteraction, ReadonlyInteraction, setDocumentResolver, setInteractionWrapper } from '@interactors/html';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      do(interaction: Interaction<void> | Interaction<void>[]): Chainable<Subject>;
      expect(interaction: ReadonlyInteraction<void> | ReadonlyInteraction<void>[]): Chainable<Subject>;
    }
  }
}

type CypressCommand = 'expect' | 'do'

setDocumentResolver(() => cy.$$('body')[0].ownerDocument);
setInteractionWrapper((interaction: Interaction<void>) => {
  return {
    ...interaction,
    check() {
        throw new Error(
          `tried to ${interaction.description} in \`cy.expect\`, actions/perform should only be run in \`cy.do\``
        );
    },
  };
});

function interact(interactions: Interaction<void>[], command: CypressCommand): void {
  interactions.forEach((interaction) => 
    cy
      .then(() =>
        command == 'expect'
          ? (interaction as ReadonlyInteraction<void>).check()
          : interaction.action()
      )
      .then(() => {
        Cypress.log({
          displayName: command,
          message: interaction.description
        });
      })
  )
};

function isInteractions(interactions: unknown[]): interactions is ReadonlyInteraction<void>[] {
  return interactions.every(isInteraction)
}

if (typeof Cypress !== 'undefined' ) {
  Cypress.Commands.add('do', (interaction: Interaction<void> | Interaction<void>[]) =>
    interact(([] as Interaction<void>[]).concat(interaction), 'do')
  );

  // NOTE: Save the original `expect` assertion method
  let chaiExpect = cy.expect as (value: unknown) => unknown

  // NOTE: Add interaction assertion function, Cypress also overrides `expect` method to a wrapper function
  Cypress.Commands.add('expect', (interaction: ReadonlyInteraction<void> | ReadonlyInteraction<void>[]) =>
    interact(([] as ReadonlyInteraction<void>[]).concat(interaction), 'expect')
  )

  // NOTE: Save the new `expect` method in which is wrapped our assertion function
  let interactionExpect = cy.expect

  // NOTE: Override Cypress's wrapper to our combined `expect`
  // @ts-expect-error TypeScript complains that signature doesn't match with declared one
  cy.expect = (
    interaction: ReadonlyInteraction<void> | ReadonlyInteraction<void>[] | unknown
  ) => {
    let interactions = Array.isArray(interaction) ? interaction : [interaction]
    if (isInteractions(interactions)) {
      return interactionExpect(interactions)
    } else {
      return chaiExpect(interaction)
    }
  }
};
