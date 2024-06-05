
import type { Operation } from '@effection/core';
import type { FilterSet } from './filter-set.ts';
import type { Locator } from './locator.ts';
import type { ActionInteraction, AssertionInteraction, Interaction } from './interaction.ts';
import type { MergeObjects } from './merge-objects.ts';
import type { MaybeMatcher } from './matcher.ts';

export type EmptyObject = Record<never, never>;

/**
 * Instances of an interactor returned by an {@link InteractorConstructor}, use
 * this class as its base. They are also extended with any additional actions
 * defined in their {@link InteractorSpecification}.
 */
export interface Interactor<E extends Element, F extends FilterParams<any, any>> {
  /**
   * @hidden
   */
  options: InteractorOptions<E, any, any>;

   /**
    * @returns a human readable description of this interactor
    */
  description: string;

  /**
   * Perform a one-off action on the given interactor. Takes a function which
   * receives an element. This function converges, which means that it is rerun
   * in a loop until it does not throw an error or times out.
   *
   * We recommend using this function for debugging only. You should normally
   * define an action in an {@link InteractorSpecification}.
   *
   * ## Example
   *
   * ``` typescript
   * await Link('Next').perform((e) => e.click());
   * ```
   */
  perform(fn: (element: E) => void): ActionInteraction<E, void>;

  /**
   * Perform a one-off assertion on the given interactor. Takes a function which
   * receives an element. This function converges, which means that it is rerun
   * in a loop until it does not throw an error or times out.
   *
   * We recommend using this function for debugging only. You should normally
   * define a filter in an {@link InteractorSpecification}.
   *
   * ## Example
   *
   * ``` typescript
   * await Link('Next').assert((e) => assert(e.tagName === 'A'));
   * ```
   */
  assert(fn: (element: E) => void): AssertionInteraction<E, void>;

  /**
   * An assertion which checks that an element matching the interactor exists.
   * Throws an error if the element does not exist.
   *
   * ## Example
   *
   * ``` typescript
   * await Link('Next').exists();
   * ```
   */
  exists(): AssertionInteraction<E, void> & FilterObject<boolean, Element>;

  /**
   * An assertion which checks that an element matching the interactor does not
   * exist. Throws an error if the element exists.
   *
   * ## Example
   *
   * ``` typescript
   * await Link('Next').absent();
   * ```
   */
  absent(): AssertionInteraction<E, void> & FilterObject<boolean, Element>;

  /**
   * Checks that there is one element matching the interactor, and that this
   * element matches the given filters. The available filters are defined by
   * the {@link InteractorSpecification}.
   *
   * ## Example
   *
   * ``` typescript
   * await Link('Home').has({ href: '/' })
   * ```
   */
  has(filters: F): AssertionInteraction<E, void>;

  /**
   * Identical to {@link has}, but reads better with some filters.
   *
   * ## Example
   *
   * ``` typescript
   * await CheckBox('Accept conditions').is({ checked: true })
   * ```
   */
  is(filters: F): AssertionInteraction<E, void>;

  /**
   * Returns a copy of the given interactor which is scoped to this interactor.
   * When there are multiple matches for an interactor, this makes it possible
   * to make them more specific by limiting the interactor to a section of the
   * page.
   *
   * ## Example
   *
   * ``` typescript
   * await Fieldset('Owner').find(TextField('Name')).fillIn('Jonas');
   * await Fieldset('Brand').find(TextField('Name')).fillIn('Volkswagen');
   * ```
   * @param interactor the interactor which should be scoped
   * @returns a scoped copy of the initial interactor
   * @typeParam T the type of the interactor that we are going to scope
   */
  find<T extends Interactor<any, any>>(interactor: T): T;

  /**
   * @hidden
   */
  apply: FilterFn<string, Element>;
}

export type ActionFn<E extends Element, I extends Interactor<E, any>> = (interactor: I, ...args: any[]) => Operation<unknown>;

export type FilterFn<T, E extends Element> = (element: E) => T;

export type FilterObject<T, E extends Element> = {
  apply: FilterFn<T, E>;
  default?: T;
}

export type FilterDefinition<T, E extends Element> = FilterFn<T, E> | FilterObject<T, E>;

export type Filters<E extends Element> = Record<string, FilterDefinition<unknown, E>>;

export type Actions<E extends Element, I extends Interactor<E, any>> = Record<string, ActionFn<E, I>>;

export type SelectorFn<E extends Element> = (parentElement: Element) => E[];

export type InteractorSpecification<E extends Element, F extends Filters<E>, A extends Actions<E, Interactor<E, EmptyObject>>> = {
  /**
   * The CSS selector that this interactor uses to find matching elements
   */
  selector?: string | SelectorFn<E>;
  actions?: A;
  filters?: F;
  /**
   * A function which returns a string value for a matched element, which can
   * be used to locate a specific instance of this interactor. The `value`
   * parameter of an {@link InteractorConstructor} must match the value
   * returned from the locator function.
   */
  locator?: FilterDefinition<string, E>;
}

export type ActionMethods<E extends Element, A extends Actions<E, I>, I extends Interactor<E, any>> = {
  [P in keyof A]: A[P] extends ((interactor: I, ...args: infer TArgs) => Operation<infer TReturn>)
    ? ((...args: TArgs) => ActionInteraction<E, TReturn>)
    : never;
}

export type FilterMethods<E extends Element, F extends Filters<E>> = {
  [P in keyof F]:
    F[P] extends FilterFn<infer TReturn, any> ? (() => AssertionInteraction<E, TReturn> & FilterObject<TReturn, Element>) :
    F[P] extends FilterObject<infer TReturn, any> ? (() => AssertionInteraction<E, TReturn> & FilterObject<TReturn, Element>) :
    never;
}

export type FilterReturn<F> = {
  [P in keyof F]?: F[P] extends MaybeMatcher<infer T> ? T : never;
}

export type FilterParams<E extends Element, F extends Filters<E>> = keyof F extends never ? never : {
  [P in keyof F]?:
    F[P] extends FilterFn<infer TArg, E> ? MaybeMatcher<TArg> :
    F[P] extends FilterObject<infer TArg, E> ? MaybeMatcher<TArg> :
    never;
}

export interface InteractorConstructorFunction<E extends Element, FP extends FilterParams<any, any>, FM extends FilterMethods<any, any>, AM extends ActionMethods<any, any, any>> {
  /**
   * The constructor can be called with filters only:
   *
   * ``` typescript
   * Link({ id: 'home-link', href: '/' });
   * ```
   *
   * Or with no arguments, this can be especially useful when finding a nested element.
   *
   * ```
   * ListItem('JavaScript').find(Link()).click(); // click the only link within a specific list item
   * ```
   *
   * @param filters An object describing a set of filters to apply, which should match the value of applying the filters defined in the {@link InteractorSpecification} to the element.
   */
    (filters?: FP): Interactor<E, FP> & FM & AM;
  /**
   * The constructor can be called with a locator:
   *
   * ``` typescript
   * Link('Home');
   * Link(/^home/i);
   * ```
   *
   * Or with a locator and options:
   *
   * ``` typescript
   * Link('Home', { href: '/' });
   * ```
   *
   * @param value The locator value, which should match the value of applying the locator function defined in the {@link InteractorSpecification} to the element.
   * @param filters An object describing a set of filters to apply, which should match the value of applying the filters defined in the {@link InteractorSpecification} to the element.
   */
  (value: MaybeMatcher<string> | RegExp, filters?: FP): Interactor<E, FP> & FM & AM;
}

/**
 * An interactor constructor is a function which can be used to initialize an
 * {@link Interactor}. When calling {@link createInteractor}, you will get
 * back an interactor constructor.
 *
 * The constructor can be called with a locator value, and an object of
 * filters. Both are optional, and can be omitted.
 *
 * @typeParam E The type of DOM Element that this interactor operates on.
 * @typeParam F the filters of this interactor, this is usually inferred from the specification
 * @typeParam A the actions of this interactor, this is usually inferred from the specification
 */
export interface InteractorConstructor<E extends Element, FP extends FilterParams<any, any>, FM extends FilterMethods<any, any>, AM extends ActionMethods<any, any, any>> extends InteractorConstructorFunction<E, FP, FM, AM> {
  interactorName: string;
  selector(value: string | SelectorFn<E>): InteractorConstructor<E, FP, FM, AM>;
  locator(value: FilterDefinition<string, E>): InteractorConstructor<E, FP, FM, AM>;
  filters<FR extends Filters<E>>(filters: FR): InteractorConstructor<E, MergeObjects<FP, FilterParams<E, FR>>, MergeObjects<FM, FilterMethods<E, FR>>, AM>;
  actions<I extends Interactor<E, FP> & FM & AM, AR extends Actions<E, I>>(actions: AR): InteractorConstructor<E, FP, FM, MergeObjects<AM, ActionMethods<E, AR, I>>>;
  extend<ER extends E = E>(name: string): InteractorConstructor<ER, FP, FM, AM>;
}

export type InteractorOptions<E extends Element, F extends Filters<E>, A extends Actions<E, Interactor<E, EmptyObject>>> = {
  name: string;
  specification: InteractorSpecification<E, F, A>;
  locator?: Locator<E>;
  filter: FilterSet<E, F>;
  ancestors: InteractorOptions<any, any, any>[];
};

export interface TInteractorConstructor<I extends InteractorConstructorFunction<any, any, any, any>> {
  (filters?: TMatch<GetMatcher<I>>): TInteractor<GetMatcher<I>> & TFilterMethods<GetFilters<I>> & TActionMethods<GetActions<I>>
  (locator: string | TMatcher<string> | RegExp, filters?: TMatch<GetMatcher<I>>): TInteractor<GetMatcher<I>> & TFilterMethods<GetFilters<I>> & TActionMethods<GetActions<I>>
}

export interface TMatcher<T> {
  typename: string;
  description: string;
  args: T[];
}

export type TMatch<T> = Partial<
  {
    [K in keyof T]: T[K] | TMatcher<T[K]>;
  }
>;

export interface TInteractor<T> {
  typename: string;
  locator?: string | TMatcher<string> | RegExp;
  match?: TMatch<T>;
  ancestors: TInteractor<any>[];
  description: string;

  find<I extends TInteractor<any>>(interactor: I): I;
  exists(): TInteraction;
  absent(): TInteraction;
  has<M>(match: TMatch<M>): TInteraction;
  is<M>(match: TMatch<M>): TInteraction;
}

export interface TInteraction {
  path: TInteractor<any>[];
  description: string;
  readonly: boolean;
}

type GetActions<T> = T extends InteractorConstructorFunction<any, any, any, infer AM> ? AM : never;
type GetFilters<T> = T extends InteractorConstructorFunction<any, any, infer FM, any> ? FM : never;
type GetMatcher<T> = T extends InteractorConstructorFunction<any, infer FP, any, any> ? FP : never;

export type TActionMethods<AM extends ActionMethods<any, any, any>> = {
  [P in keyof AM]: AM[P] extends (...args: infer TArgs) => Interaction<any, any>
    ? (...args: TArgs) => TInteraction
    : never;
};

export type TFilterMethods<FM extends FilterMethods<any, any>> = {
  [P in keyof FM]: () => TInteraction;
};
