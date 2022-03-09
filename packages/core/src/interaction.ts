/* eslint-disable @typescript-eslint/no-explicit-any */
import { Operation, Task, run, Symbol } from '@effection/core';
import { InteractionOptions as SerializedInteractionOptions, globals, InteractionType } from '@interactors/globals';
import type { Interactor, FilterObject, FilterFn, FilterParams } from './specification';
import { serializeInteractionOptions } from './serialize';

const interactionSymbol: unique symbol = Symbol.for('interaction') as any;

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
  /**
   * Return a description of the interaction
   */
  description: string;
  /**
   * Return a code representation of the interaction
   */
  code: () => string;
  /**
   * Return a serialized options of the interaction
   */
  options: SerializedInteractionOptions;
  /**
   * Perform the interaction
   */
  action: () => Task<T>;

  check?: () => Task<T>;

  halt: () => Promise<void>;

  [interactionSymbol]: true;
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

export type InteractionOptions<E extends Element, T> = {
  name: string;
  description: string;
  filters?: FilterParams<any, any>;
  args?: unknown[];
  interactor: Interactor<E, any>;
  run: (interactor: Interactor<E, any>) => Operation<T>;
}

export function createInteraction<E extends Element, T>(type: 'action', options: InteractionOptions<E, T>): ActionInteraction<E, T>
export function createInteraction<E extends Element, T>(type: 'assertion', options: InteractionOptions<E, T>): AssertionInteraction<E, T>
export function createInteraction<E extends Element, T, Q>(type: 'action', options: InteractionOptions<E, T>, apply: FilterFn<Q, Element>): ActionInteraction<E, T> & FilterObject<Q, Element>
export function createInteraction<E extends Element, T, Q>(type: 'assertion', options: InteractionOptions<E, T>, apply: FilterFn<Q, Element>): AssertionInteraction<E, T> & FilterObject<Q, Element>
export function createInteraction<E extends Element, T, Q>(type: InteractionType, options: InteractionOptions<E, T>, apply?: FilterFn<Q, Element>): Interaction<E, T> & Operation<T> {
  let task: Task<T>;

  function operation(scope: Task): Operation<T> {
    let run = () => options.run(options.interactor);

    // function execute(task: Task): Task<T> {
    //   return task.run(options.run(options.interactor));
    // }
    return (globals.wrapInteraction
      ? globals.wrapInteraction(interaction, () => scope.run(run))
      : globals.wrapAction(interaction.description, () => scope.run(run), type)) as Operation<T>;

    // return function* () {
    //   // NOTE: If effection gets Promise it will fulfill and treat the result as ended value
    //   // NOTE: Sometimes original interaction function might be wrapped multiple times into async function
    //   // NOTE: That means effection returns the original interaction function from a wrapped one instead of executing it
    //   // NOTE: We `yield` operation until we get the `run` function which returns a generator
    //   // NOTE: Then we yield it and return a result
    //   while (operation != run) {
    //     operation = yield operation
    //   }
    //   return yield operation;
    // } as Operation<T>;
  };

  function action(): Task<T> {
    if(!task) {
      task = run(operation);
    }
    return task;
  };

  let serializedOptions = serializeInteractionOptions(type, options)
  let interaction: Interaction<E, T> & Operation<T> = {
    type,
    options: serializedOptions,
    description: options.description,
    interactor: options.interactor,
    run: options.run,
    action,
    check: type === 'assertion' ? action : undefined,
    code: () => serializedOptions.code(),
    halt: () => action().halt(),
    [interactionSymbol]: true,
    [Symbol.toStringTag]: `[interaction ${options.description}]`,
    [Symbol.operation]: operation,
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
  if (apply) {
    return Object.assign(interaction, { apply });
  } else {
    return interaction;
  }
}
