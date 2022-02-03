/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
import { setDocumentResolver, addInteractionWrapper } from '@interactors/globals';
import { Interaction, isInteraction, AssertionInteraction } from '@interactors/core';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      do(interaction: Interaction<Element> | Interaction<Element>[]): Chainable<Subject>;
      expect(interaction: AssertionInteraction<Element> | AssertionInteraction<Element>[]): Chainable<Subject>;
    }
  }
}

let cypressCommand: CypressCommand | null = null
type CypressCommand = 'expect' | 'do'

setDocumentResolver(() => cy.$$('body')[0].ownerDocument);
addInteractionWrapper((interaction, operation) =>
  () => {
    if (interaction.type == 'action' && cypressCommand == 'expect')
      throw new Error(`tried to ${interaction.description} in \`cy.expect\`, actions/perform should only be run in \`cy.do\``);
    return operation
  }
);

function interact(interactions: Interaction<Element>[], command: CypressCommand): void {
  interactions
    .reduce((cy: Cypress.Chainable<void>, interaction) =>
      cy
        .then(() => interaction)
        .then(() => {
          Cypress.log({
            displayName: command,
            message: interaction.description
          });
        }),
      cy.then(() => void (cypressCommand = command))
    ).then(() => (cypressCommand = null))
};

function isInteractions(interactions: unknown[]): interactions is AssertionInteraction<Element>[] {
  return interactions.every(isInteraction)
}

if (typeof Cypress !== 'undefined' ) {
  Cypress.Commands.add('do', (interaction: Interaction<Element> | Interaction<Element>[]) =>
    interact(([] as Interaction<Element>[]).concat(interaction), 'do')
  );

  // NOTE: Save the original `expect` assertion method
  let chaiExpect = cy.expect as (value: unknown) => unknown

  // NOTE: Add interaction assertion function, Cypress also overrides `expect` method to a wrapper function
  Cypress.Commands.add('expect', (interaction: AssertionInteraction<Element> | AssertionInteraction<Element>[]) =>
    interact(([] as AssertionInteraction<Element>[]).concat(interaction), 'expect')
  )

  // NOTE: Save the new `expect` method in which is wrapped our assertion function
  let interactionExpect = cy.expect

  // NOTE: Override Cypress's wrapper to our combined `expect`
  // @ts-expect-error TypeScript complains that signature doesn't match with declared one
  cy.expect = (
    interaction: AssertionInteraction<Element> | AssertionInteraction<Element>[] | unknown
  ) => {
    let interactions = Array.isArray(interaction) ? interaction : [interaction]
    if (isInteractions(interactions)) {
      return interactionExpect(interactions)
    } else {
      return chaiExpect(interaction)
    }
  }
};
