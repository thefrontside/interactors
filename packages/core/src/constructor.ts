/* eslint-disable @typescript-eslint/no-explicit-any */

import { converge } from './converge.ts';
import type { MergeObjects } from './merge-objects.ts';
import type {
  InteractorOptions,
  ActionMethods,
  InteractorConstructor,
  Interactor,
  Filters,
  Actions,
  FilterDefinition,
  FilterParams,
  FilterMethods,
  InteractorSpecification,
  FilterObject,
} from './specification.ts';
import { FilterSet } from './filter-set.ts';
import { Locator } from './locator.ts';
import { MatchFilter, applyFilter } from './match.ts';
import { formatDescription } from './format.ts';
import { FilterNotMatchingError } from './errors.ts';
import { createInteraction, type AssertionInteraction, type ActionInteraction } from './interaction.ts';
import { isMatcher } from './matcher.ts';
import { matching } from './matchers/matching.ts';
import { hasMatchMatching, resolveEmpty, resolveFirst, resolveUnique, unsafeSyncResolveParent, unsafeSyncResolveUnique } from './resolvers.ts';

const defaultLocator: FilterDefinition<string, Element> = (element) => element.textContent || "";

/**
 * Removes any default values for a filter from the lookup if that filter is present in the
 * assertion. Otherwise, it is not possible to make an assertion on a filter that might conflict
 * see https://github.com/thefrontside/bigtest/issues/966
*/
function getLookupFilterForAssertion<E extends Element, F extends Filters<E>>(filter: FilterSet<E, F>, filters: FilterParams<E, F>): FilterSet<E, F> {
  let lookupFilter = new FilterSet(filter.specification, Object.assign({}, filter.filters));
  let specFilters = lookupFilter.specification.filters;
  for (let key in specFilters) {
    if (typeof specFilters[key] !== 'function'
    && 'default' in specFilters[key]
    && key in filters
    && !(key in lookupFilter.filters)) {
      lookupFilter.filters[key] = filters[key];
    }
  }
  return lookupFilter;
}

export function instantiateInteractor<E extends Element, F extends Filters<E>, A extends Actions<E, Interactor<E, FilterParams<E, F>>>>(
  options: InteractorOptions<E, F, A>,
  resolver: (options: InteractorOptions<E, F, A>) => E
): Interactor<E, FilterParams<E, F>> & FilterMethods<E, F> & ActionMethods<E, A, Interactor<E, FilterParams<E, F>>> {
  let interactor = {
    options,

    get description(): string {
      return formatDescription(options);
    },

    perform<T>(fn: (element: E) => T): ActionInteraction<E, T> {
      return createInteraction('action', {
        name: "perform",
        interactor,
        args: [],
        description: `run perform on ${formatDescription(options)}`,
        run: (interactor) => converge(() => fn(resolver(interactor.options))),
      });
    },

    assert(fn: (element: E) => void): AssertionInteraction<E> {
      return createInteraction('assertion', {
        name: "assert",
        interactor,
        args: [],
        description: `${formatDescription(options)} asserts`,
        run: (interactor) => converge(() => { fn(resolver(interactor.options)) }),
      });
    },

    has(filters: FilterParams<E, F>): AssertionInteraction<E> {
      return interactor.is(filters);
    },

    is(filters: FilterParams<E, F>): AssertionInteraction<E> {
      let filter = new FilterSet(options.specification, filters);
      return createInteraction('assertion', {
        name: "is",
        interactor,
        args: [filters],
        filters,
        description: `${formatDescription(options)} matches filters: ${filter.description}`,
        run: (interactor) => converge(() => {
          let element = resolver({...interactor.options, filter: getLookupFilterForAssertion(interactor.options.filter, filters) });
          let match = new MatchFilter(element, filter);
          if (!match.matches) {
            throw new FilterNotMatchingError(`${formatDescription(options)} does not match filters:\n\n${match.formatAsExpectations()}`);
          }
        }),
      });
    },

    find<T extends Interactor<any, any>>(child: T): T {
      return instantiateInteractor({
        ...child.options,
        ancestors: [...options.ancestors, options, ...child.options.ancestors]
      }, resolver) as unknown as T;
    },

    exists(): AssertionInteraction<E> & FilterObject<boolean, Element> {
      return createInteraction('assertion', {
        name: 'exists',
        interactor,
        args: [],
        description: `${formatDescription(options)} exists`,
        run: (interactor) => converge(() => {
          resolveFirst(unsafeSyncResolveParent(interactor.options), options);
        }),
      }, (element) => hasMatchMatching(element, options));
    },

    absent(): AssertionInteraction<E> & FilterObject<boolean, Element> {
      return createInteraction('assertion', {
        name: 'absent',
        interactor,
        args: [],
        description: `${formatDescription(options)} does not exist`,
        run: (interactor) => converge(() => {
          resolveEmpty(unsafeSyncResolveParent(interactor.options), options);
        }),
      }, (element) => !hasMatchMatching(element, options));
    },

    apply(parentElement: Element): string {
      let element = [...options.ancestors, options].reduce(resolveUnique, parentElement);
      return applyFilter(options.specification.locator || defaultLocator, element);
    }
  };

  for (let [actionName, action] of Object.entries(options.specification.actions || {})) {
    if (!interactor.hasOwnProperty(actionName)) {
      Object.defineProperty(interactor, actionName, {
        value: function(...args: unknown[]) {
          let actionDescription = actionName;
          if (args.length) {
            actionDescription += ` with ` + args.map((a) => JSON.stringify(a)).join(', ');
          }
          return createInteraction('action', {
            name: actionName,
            interactor,
            args,
            description: `${actionDescription} on ${formatDescription(options)}`,
            run: (interactor) => action(interactor as Interactor<E, FilterParams<E, F>> & FilterMethods<E, F> & ActionMethods<E, A, Interactor<E, FilterParams<E, F>>>, ...args)
          });
        },
        configurable: true,
        writable: true,
        enumerable: false,
      });
    }
  }

  for (let [filterName, filter] of Object.entries(options.specification.filters || {})) {
    if (!Object.prototype.hasOwnProperty.call(interactor, filterName)) {
      Object.defineProperty(interactor, filterName, {
        value: function() {
          return createInteraction('assertion', {
            name: filterName,
            interactor,
            args: [],
            description: `${filterName} of ${formatDescription(options)}`,
            run: (interactor) => converge(() => applyFilter(filter, resolver(interactor.options))),
          }, (parentElement) => {
            let element = [...options.ancestors, options].reduce(resolveUnique, parentElement);
            return applyFilter(filter, element);
          });
        },
        configurable: true,
        writable: true,
        enumerable: false,
      });
    }
  }

  return interactor as Interactor<E, FilterParams<E, F>> & FilterMethods<E, F> & ActionMethods<E, A, Interactor<E, FilterParams<E, F>>>;
}

export function createConstructor<E extends Element, FP extends FilterParams<any, any>, FM extends FilterMethods<any, any>, AM extends ActionMethods<any, any, any>>(
  name: string,
  specification: InteractorSpecification<E, any, any>,
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

  return Object.assign(initInteractor, {
    interactorName: name,
    selector: (value: string): InteractorConstructor<E, FP, FM, AM> => {
      return createConstructor(name, { ...specification, selector: value });
    },
    locator: (value: FilterDefinition<string, E>): InteractorConstructor<E, FP, FM, AM> => {
      return createConstructor(name, { ...specification, locator: value });
    },
    filters: <FR extends Filters<E>>(filters: FR): InteractorConstructor<E, MergeObjects<FP, FilterParams<E, FR>>, MergeObjects<FM, FilterMethods<E, FR>>, AM> => {
      return createConstructor(name, { ...specification, filters: { ...specification.filters, ...filters } });
    },
    actions: <I extends Interactor<E, FP> & FM & AM, AR extends Actions<E, I>>(actions: AR): InteractorConstructor<E, FP, FM, MergeObjects<AM, ActionMethods<E, AR, I>>> => {
      return createConstructor(name, { ...specification, actions: Object.assign({}, specification.actions, actions) });
    },
    extend: <ER extends Element = E>(newName: string): InteractorConstructor<ER, FP, FM, AM> => {
      return createConstructor(newName, specification) as unknown as InteractorConstructor<ER, FP, FM, AM>;
    },
  }) as unknown as InteractorConstructor<E, FP, FM, AM>;
}
