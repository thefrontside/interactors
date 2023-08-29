/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
import { setDocumentResolver, addInteractionWrapper } from '@interactors/globals';
import { Interaction, isInteraction, AssertionInteraction } from '@interactors/core';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      do<E extends Element>(interaction: Interaction<E, void> | Interaction<E, void>[]): Chainable<Subject>;
      expect<E extends Element>(interaction: AssertionInteraction<E, void> | AssertionInteraction<E, void>[]): Chainable<Subject>;
      expectInteractor<E extends Element>(interaction: AssertionInteraction<E, void> | AssertionInteraction<E, void>[]): Chainable<Subject>;
    }
  }
}

let cypressCommand: CypressCommand | null = null
type CypressCommand = 'expect' | 'do'

setDocumentResolver(() => cy.$$('body')[0].ownerDocument);
addInteractionWrapper((operation, interaction) =>
  () => {
    if (interaction.type == 'action' && cypressCommand == 'expect')
      throw new Error(`tried to ${interaction.description} in \`cy.expect\`, actions/perform should only be run in \`cy.do\``);
    return operation
  }
);

function interact(interactions: Interaction<Element, void>[], command: CypressCommand): void {
  interactions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .reduce((cy: Cypress.Chainable<any>, interaction) =>
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

function isInteractions(interactions: unknown[]): interactions is AssertionInteraction<Element, void>[] {
  return interactions.every(isInteraction)
}

if (typeof Cypress !== 'undefined' ) {
  Cypress.Commands.add('do', (interaction: Interaction<Element, void> | Interaction<Element, void>[]) =>
    interact(([] as Interaction<Element, void>[]).concat(interaction), 'do')
  );

  // NOTE: Save the original `expect` assertion method
  let chaiExpect = cy.expect as (value: unknown, message?: string) => unknown

  let interactionExpect = (interaction: AssertionInteraction<Element, void> | AssertionInteraction<Element, void>[]) => (
    interact(([] as AssertionInteraction<Element, void>[]).concat(interaction), 'expect')
  )
  try {
    // NOTE: Add interaction assertion function, Cypress also overrides `expect` method to a wrapper function
    // This need for Cypress <10 versions
    Cypress.Commands.add('expect', interactionExpect);
  }
  catch (e) {}
  if ('_commands' in Cypress.Commands) {
    // @ts-expect-error Cypress stores a reference to commands object and use it to check overwritability of commands
    // https://github.com/cypress-io/cypress/blob/d378ec423a4a2799f90a6536f82e4504bc8b3c9e/packages/driver/src/cypress/commands.ts#L155
    Cypress.Commands._commands['expect'] = interactionExpect;
    // NOTE: Add interaction assertion function, Cypress also overrides `expect` method to a wrapper function
    // @ts-expect-error TypeScript complains that signature doesn't match with declared one
    Cypress.Commands.overwrite('expect', interactionExpect);
  }

  // NOTE: Fallback alias for `expect` assertion method
  Cypress.Commands.add('expectInteractor', interactionExpect);

  // NOTE: Override Cypress's wrapper to our combined `expect`
  // @ts-expect-error TypeScript complains that signature doesn't match with declared one
  cy.expect = (
    interaction: AssertionInteraction<Element, void> | AssertionInteraction<Element, void>[] | unknown,
    message?: string
  ) => {
    let interactions = Array.isArray(interaction) ? interaction : [interaction]
    if (isInteractions(interactions)) {
      return interactionExpect(interactions)
    } else {
      return chaiExpect(interaction, message)
    }
  }
};
