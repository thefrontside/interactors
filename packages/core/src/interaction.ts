/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InteractionOptions as SerializedInteractionOptions, InteractionType } from '@interactors/globals';
import type { Interactor, FilterObject, FilterFn, FilterParams } from './specification.ts';
import { serializeInteractionOptions } from './serialize.ts';

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
  run: (interactor: Interactor<E, any>) => Promise<T>;
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
  action: () => Promise<T>;

  check?: () => Promise<T>;

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
  check: () => Promise<T>;
}

export type InteractionOptions<E extends Element, T> = {
  name: string;
  description: string;
  filters?: FilterParams<any, any>;
  args: unknown[];
  interactor: Interactor<E, any>;
  run: (interactor: Interactor<E, any>) => Promise<T>;
}

export function createInteraction<E extends Element, T>(type: 'action', options: InteractionOptions<E, T>): ActionInteraction<E, T>
export function createInteraction<E extends Element, T>(type: 'assertion', options: InteractionOptions<E, T>): AssertionInteraction<E, T>
export function createInteraction<E extends Element, T, Q>(type: 'action', options: InteractionOptions<E, T>, apply: FilterFn<Q, Element>): ActionInteraction<E, T> & FilterObject<Q, Element>
export function createInteraction<E extends Element, T, Q>(type: 'assertion', options: InteractionOptions<E, T>, apply: FilterFn<Q, Element>): AssertionInteraction<E, T> & FilterObject<Q, Element>
export function createInteraction<E extends Element, T, Q>(type: InteractionType, options: InteractionOptions<E, T>, apply?: FilterFn<Q, Element>): Interaction<E, T> {
  let promise: Promise<T>;

  let operation = () => options.run(options.interactor);
  
  function action(): Promise<T> {
    if(!promise) {
      promise = operation();
    }
    return promise;
  };

  let serializedOptions = serializeInteractionOptions(type, options)
  let interaction: Interaction<E, T> = {
    type,
    options: serializedOptions,
    description: options.description,
    interactor: options.interactor,
    run: options.run,
    //    args: options.args,
    action,
    check: type === 'assertion' ? action : undefined,
    code: () => serializedOptions.code(),
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
    },
  }
  if (apply) {
    return Object.assign(interaction, { apply });
  } else {
    return interaction;
  }
}
