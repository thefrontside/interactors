/* eslint-disable @typescript-eslint/no-explicit-any */
import { Operation, Task, run } from '@effection/core';
import { globals } from '@interactors/globals';
import type { Interactor, FilterObject, FilterFn } from './specification';

const interactionSymbol = Symbol.for('interaction');

export type InteractionType = "action" | "assertion";

export function isInteraction(x: unknown): x is Interaction<Element, unknown> {
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
export interface Interaction<E extends Element, T = void> extends Promise<T> {
  type: InteractionType;

  interactor: Interactor<E, any>;
  run: (interactor: Interactor<E, any>) => Operation<T>;
  operation: Operation<T>;
  /**
   * Return a description of the interaction
   */
  description: string;
  /**
   * Perform the interaction
   */
  action: () => Task<T>;

  check?: () => Task<T>;

  halt: () => Promise<void>;

  [interactionSymbol]: true
}

export interface ActionInteraction<E extends Element, T = void> extends Interaction<E, T> {
  type: "action";
  check: undefined;
}

/**
 * Like {@link Interaction}, except that it is used for assertions only.
 *
 * @typeParam T the return value of the promise that this interaction evaluates to.
 */
export interface AssertionInteraction<E extends Element, T = void> extends Interaction<E, T> {
  type: "assertion";
  /**
   * Perform the check
   */
  check: () => Task<T>;
}

type InteractionOptions<E extends Element, T> = {
  description: string;
  interactor: Interactor<E, any>;
  run: (interactor: Interactor<E, any>) => Operation<T>;
}

export function createInteraction<E extends Element, T>(type: 'action', options: InteractionOptions<E, T>): ActionInteraction<E, T>
export function createInteraction<E extends Element, T>(type: 'assertion', options: InteractionOptions<E, T>): AssertionInteraction<E, T>
export function createInteraction<E extends Element, T, Q>(type: 'action', options: InteractionOptions<E, T>, apply: FilterFn<Q, Element>): ActionInteraction<E, T> & FilterObject<Q, Element>
export function createInteraction<E extends Element, T, Q>(type: 'assertion', options: InteractionOptions<E, T>, apply: FilterFn<Q, Element>): AssertionInteraction<E, T> & FilterObject<Q, Element>
export function createInteraction<E extends Element, T, Q>(type: InteractionType, options: InteractionOptions<E, T>, apply?: FilterFn<Q, Element>): Interaction<E, T> {
  let task: Task<T>;

  function operation(): Operation<T> {
    let operation = options.run(options.interactor);

    for(let wrapper of globals.interactionWrappers) {
      operation = wrapper(interaction, operation);
    };

    return operation;
  };

  function action(): Task<T> {
    if(!task) {
      task = run(operation());
    }
    return task;
  };

  let interaction: Interaction<E, T> = {
    type,
    description: options.description,
    interactor: options.interactor,
    run: options.run,
    get operation() { return operation() },
    action,
    halt: () => action().halt(),
    [interactionSymbol]: true,
    [Symbol.toStringTag]: `[interaction ${options.description}]`,
    then(onFulfill, onReject) {
      return action().then(onFulfill, onReject);
    },
    catch(onReject) {
      return action().catch(onReject);
    },
    finally(handler) {
      return action().finally(handler);
    }
  }
  if(type === 'assertion') {
    interaction.check = interaction.action;
  }
  if(apply) {
    return Object.assign(interaction, { apply });
  } else {
    return interaction;
  }
}
