import { ActionEvent, ActionOptions, globals } from '@interactors/globals';
import type { FilterObject } from './specification';

const interactionSymbol = Symbol.for('interaction');

export function isInteraction(x: unknown): x is Interaction<unknown> {
  return typeof x === 'object' && x != null && interactionSymbol in x
}

/**
 * An interaction represents some type of action or assertion that can be
 * taken on an {@link Interactor}.
 *
 * The interaction can function as a lazy promise. That means that calling
 * `then` on the interaction or awaiting it using `await`, will run the
 * interaction and the promise will resolve once the action is complete.
 * However, an interaction which is not awaited will not run by itself.
 *
 * @typeParam T the return value of the promise that this interaction evaluates to.
 */
export interface Interaction<T> extends Promise<T> {
  /**
   * Return a description of the interaction
   */
  description: string;
  /**
   * Perform the interaction
   */
  action: () => Promise<T>;

  [interactionSymbol]: true
}

/**
 * Like {@link Interaction}, except that it is used for assertions only.
 *
 * @typeParam T the return value of the promise that this interaction evaluates to.
 */
export interface ReadonlyInteraction<T> extends Interaction<T> {
  /**
   * Perform the check
   */
  check: () => Promise<T>;
}

function createInteraction<T>(description: string, action: () => Promise<T>): Interaction<T> {
  let promise: Promise<T>;
  return {
    description,
    action,
    [interactionSymbol]: true,
    [Symbol.toStringTag]: `[interaction ${description}]`,
    then(onFulfill, onReject) {
      if(!promise) { promise = this.action(); }
      return promise.then(onFulfill, onReject);
    },
    catch(onReject) {
      if(!promise) { promise = this.action(); }
      return promise.catch(onReject);
    },
    finally(handler) {
      if(!promise) { promise = this.action(); }
      return promise.finally(handler);
    }
  }
}

export function interaction<T>(description: string, action: () => Promise<T>, options: ActionOptions): Interaction<T> {
  return createInteraction(
    description,
    globals.wrapAction(
      Object.assign(new String(description), { description, action, options }) as string & ActionEvent<T>,
      action,
      options.type
    )
  )
}

export function check<T>(interaction: Interaction<T>): ReadonlyInteraction<T> {
  return { check() { return interaction.action() }, ...interaction };
}

export function interactionFilter<T, Q>(interaction: Interaction<T>, filter: (element: Element) => Q): Interaction<T> & FilterObject<Q, Element> {
  return { apply: filter, ...interaction };
}

export function checkFilter<T, Q>(interaction: Interaction<T>, filter: (element: Element) => Q): ReadonlyInteraction<T> & FilterObject<Q, Element> {
  return { apply: filter , ...check(interaction) };
}
