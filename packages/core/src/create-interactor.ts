/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ActionMethods, Actions, EmptyObject, FilterDefinition, FilterMethods, FilterParams, Filters, Interactor, InteractorConstructor, InteractorConstructorFunction, InteractorSpecification, TInteractorConstructor, TMatch, TInteractor, TActionMethods, TFilterMethods, TInteraction } from './specification.ts';
import { instantiateInteractor } from './constructor.ts';
import { matching } from './matchers/matching.ts';
import { isMatcher, matcherDescription } from './matcher.ts';
import { Locator, defaultLocator } from './locator.ts';
import { FilterSet, filtersDescription } from './filter-set.ts';
import { unsafeSyncResolveUnique } from './resolvers.ts';
import type { MergeObjects } from './merge-objects.ts';

/**
 * Create a custom interactor with the given name.
 *
 * ### Creating a simple interactor
 *
 * ``` typescript
 * let Paragraph = createInteractor('paragraph').selector('p');
 * ```
 *
 * Note the double function call!
 *
 * @param interactorName The human readable name of the interactor, used mainly for debugging purposes and error messages
 * @typeParam E The type of DOM Element that this interactor operates on. By specifying the element type, actions and filters defined for the interactor can be type checked against the actual element type.
 * @returns You will need to call the returned builder to create an interactor.
 */
export function createInteractor<E extends Element, FP extends FilterParams<any, any> = EmptyObject, FM extends FilterMethods<any, any> = EmptyObject, AM extends ActionMethods<any, any, any> = EmptyObject>(
  name: string,
  specification: InteractorSpecification<E, any, any> = {},
): InteractorConstructor<E, FP, FM, AM> {
  function initInteractor(...args: any[]) {
    let locator, filter;
    let locatorValue = args[0] instanceof RegExp ? matching(args[0]) : args[0]
    if (typeof(locatorValue) === 'string' || isMatcher(locatorValue)) {
      locator = new Locator(specification.locator || defaultLocator, locatorValue);
      filter = new FilterSet(specification, args[1] || {});
    } else {
      filter = new FilterSet(specification, args[0] || {});
    }
    return instantiateInteractor({ name, specification, filter, locator, ancestors: [] }, unsafeSyncResolveUnique);
  }

  Interactors.add(initInteractor);

  return Object.assign(initInteractor, {
    interactorName: name,
    selector: (value: string): InteractorConstructor<E, FP, FM, AM> => {
      return createInteractor(name, { ...specification, selector: value });
    },
    locator: (value: FilterDefinition<string, E>): InteractorConstructor<E, FP, FM, AM> => {
      return createInteractor(name, { ...specification, locator: value });
    },
    filters: <FR extends Filters<E>>(filters: FR): InteractorConstructor<E, MergeObjects<FP, FilterParams<E, FR>>, MergeObjects<FM, FilterMethods<E, FR>>, AM> => {
      return createInteractor(name, { ...specification, filters: { ...specification.filters, ...filters } });
    },
    actions: <I extends Interactor<E, FP> & FM & AM, AR extends Actions<E, I>>(actions: AR): InteractorConstructor<E, FP, FM, MergeObjects<AM, ActionMethods<E, AR, I>>> => {
      return createInteractor(name, { ...specification, actions: Object.assign({}, specification.actions, actions) });
    },
    extend: <ER extends Element = E>(newName: string): InteractorConstructor<ER, FP, FM, AM> => {
      return createInteractor(newName, specification) as unknown as InteractorConstructor<ER, FP, FM, AM>;
    },
    builder: <T>(transform: (interaction: TInteraction) => T = x => x as T): TInteractorConstructor<T, InteractorConstructorFunction<E, FP, FM, AM>> => {
      return ((...args: Parameters<TInteractorConstructor<T, InteractorConstructorFunction<E, FP, FM, AM>>>) => {
        let interactor = {
          typename: name,
          locator: args[0],
          match: args[1],
          ancestors: [] as TInteractor<any>[],
          get description() {
            return [
              interactor.match
              ? `${interactor.typename} ${matcherDescription(interactor.locator)} ${filtersDescription(interactor.match)}`.trim()
              : `${interactor.typename} ${matcherDescription(interactor.locator)}`.trim(),
              ...interactor.ancestors.map((i) => i.description).reverse()
            ].join(' within ');
          },

          find(i) {
            i.ancestors = interactor.ancestors.concat(interactor, ...i.ancestors)
            return i
          },
          exists() {
            return transform({
              name: 'exists',
              path: interactor.ancestors.concat(interactor).map(({ typename, locator, match, description }) => ({ typename, locator, match, description })),
              get description() { return `${interactor.description} exists` },
              readonly: true,
              args: [],
            })
          },
          absent() {
            return transform({
              name: 'absent',
              path: interactor.ancestors.concat(interactor).map(({ typename, locator, match, description }) => ({ typename, locator, match, description })),
              get description() { return `${interactor.description} does not exist` },
              readonly: true,
              args: [],
            })
          },
          has<M>(match: TMatch<M>) {
            return transform({
              name: 'has',
              path: interactor.ancestors.concat(interactor).map(({ typename, locator, match, description }) => ({ typename, locator, match, description })),
              get description() { return `${interactor.description} matches filters: ${filtersDescription(match)}` },
              readonly: true,
              args: [match],
            })
          },
          is<M>(match: TMatch<M>) {
            return transform({
              name: 'is',
              path: interactor.ancestors.concat(interactor).map(({ typename, locator, match, description }) => ({ typename, locator, match, description })),
              get description() { return `${interactor.description} matches filters: ${filtersDescription(match)}` },
              readonly: true,
              args: [match],
            })
          },

          ...(Object.keys(specification.actions || {}).reduce((actions, name) => ({
            ...actions,
            [name]: function(...args: unknown[]) {
              return transform({
                name,
                path: interactor.ancestors.concat(interactor).map(({ typename, locator, match, description }) => ({ typename, locator, match, description })),
                get description() {
                  let actionDescription = name;
                  if (args.length) {
                    actionDescription += ` with ` + args.map((a) => JSON.stringify(a)).join(', ');
                  }
                  return `${actionDescription} on ${interactor.description}`;
                },
                readonly: false,
                args,
              })
            }
          }), {} as TActionMethods<T, AM>)),

          ...(Object.keys(specification.filters || {}).reduce((filters, name) => ({
            ...filters,
            [name]: function() {
              return transform({
                name,
                path: interactor.ancestors.concat(interactor).map(({ typename, locator, match, description }) => ({ typename, locator, match, description })),
                get description() {
                  return `${name} of ${interactor.description}`;
                },
                readonly: true,
                args: [],
              })
            }
          }), {} as TFilterMethods<T, FM>)),
        } as ReturnType<TInteractorConstructor<T, InteractorConstructorFunction<E, FP, FM, AM>>>
        return interactor
      }) as unknown as TInteractorConstructor<T, InteractorConstructorFunction<E, FP, FM, AM>>
    }
  }) as unknown as InteractorConstructor<E, FP, FM, AM>;
}

export abstract class InitInteractor {
  static [Symbol.hasInstance](instance: () => Interactor<any, any>): boolean {
    return Interactors.has(instance);
  }
}

const Interactors = new WeakSet<() => Interactor<any, any>>();
