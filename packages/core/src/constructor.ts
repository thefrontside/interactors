import { converge } from './converge.ts';
import type {
  InteractorOptions,
  ActionMethods,
  Interactor,
  Filters,
  Actions,
  FilterParams,
  FilterMethods,
  FilterObject,
} from "./specification.ts";
import { FilterSet } from './filter-set.ts';
import { MatchFilter, applyFilter } from './match.ts';
import { formatDescription } from './format.ts';
import { FilterNotMatchingError } from './errors.ts';
import { createInteraction, type AssertionInteraction, type ActionInteraction } from "./interaction.ts";
import { hasMatchMatching, resolveEmpty, resolveFirst, resolveUnique, unsafeSyncResolveParent } from './resolvers.ts';
import { defaultLocator } from './locator.ts';

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (!Object.prototype.hasOwnProperty.call(interactor, actionName)) {
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
