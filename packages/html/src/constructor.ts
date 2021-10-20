/* eslint-disable @typescript-eslint/no-explicit-any */

import { globals } from '@interactors/globals';
import { converge } from './converge';
import { MergeObjects } from './merge-objects';
import {
  InteractorOptions,
  ActionMethods,
  LocatorFn,
  InteractorConstructor,
  Interactor,
  Filters,
  Actions,
  FilterParams,
  FilterMethods,
  InteractorSpecification,
  BaseInteractor,
  FilterObject,
} from './specification';
import { Filter } from './filter';
import { Locator } from './locator';
import { MatchFilter, applyFilter } from './match';
import { formatTable } from './format-table';
import { FilterNotMatchingError } from './errors';
import { interaction, interactionFilter, check, checkFilter, Interaction, ReadonlyInteraction } from './interaction';
import { Match } from './match';
import { NoSuchElementError, NotAbsentError, AmbiguousElementError } from './errors';
import { isMatcher } from './matcher';
import { matching } from './matchers/matching';

const defaultLocator: LocatorFn<Element> = (element) => element.textContent || "";
const defaultSelector = 'div';

export function findElements<E extends Element>(parentElement: Element, interactor: InteractorOptions<any, any, any>): E[] {
  if(interactor.specification.selector === ':root') {
    // this is a bit of a hack, because otherwise there isn't a good way of selecting the root element
    return [parentElement.ownerDocument.querySelector(':root') as E];
  } else {
    return Array.from(parentElement.querySelectorAll(interactor.specification.selector || defaultSelector));
  }
}

function findMatches(parentElement: Element, interactor: InteractorOptions<any, any, any>): Match<Element, any>[] {
  if (!interactor.name) {
    throw new Error('One of your interactors was created without a name. Please provide a label for your interactor:\n\tHTML.extend(\'my interactor\') || createInteractor(\'my interactor\')');
  }
  return findElements(parentElement, interactor).map((e) => new Match(e, interactor.filter, interactor.locator));
}

function findMatchesMatching(parentElement: Element, interactor: InteractorOptions<any, any, any>): Match<Element, any>[] {
  return findMatches(parentElement, interactor).filter((m) => m.matches);
}

function findMatchesNonEmpty(parentElement: Element, interactor: InteractorOptions<any, any, any>): Match<Element, any>[] {
  let matches = findMatches(parentElement, interactor);
  let matching = matches.filter((m) => m.matches);
  if(matching.length > 0) {
    return matching;
  } else if(matches.length === 0) {
    throw new NoSuchElementError(`did not find ${description(interactor)}`);
  } else {
    let table = formatTable({
      headers: interactor.locator ? [interactor.name, ...interactor.filter.asTableHeader()] : interactor.filter.asTableHeader(),
      rows: matches.slice().sort((a, b) => b.sortWeight - a.sortWeight).map((m) => m.asTableRow()),
    });
    throw new NoSuchElementError(`did not find ${description(interactor)}, did you mean one of:\n\n${table}`);
  }
}

// Given a parent element, and an interactor, find exactly one matching element
// and return it. If no elements match, raise an error. If more than one
// element matches, raise an error.
export function resolveUnique(parentElement: Element, interactor: InteractorOptions<any, any, any>): Element {
  let matching = findMatchesNonEmpty(parentElement, interactor);

  if(matching.length === 1) {
    return matching[0].element;
  } else {
    let alternatives = matching.map((m) => '- ' + m.elementDescription());
    throw new AmbiguousElementError(`${description(interactor)} matches multiple elements:\n\n${alternatives.join('\n')}`);
  }
}

// Given a parent element, and an interactor, find all matching elements and
// return them. If no elements match, raise an error.
export function resolveNonEmpty(parentElement: Element, interactor: InteractorOptions<any, any, any>): Element[] {
  return findMatchesNonEmpty(parentElement, interactor).map(m => m.element);
}

// Given a parent element, and an interactor, check if there are any matching
// elements, and throw an error if there are. Otherwise return undefined.
export function resolveEmpty(parentElement: Element, interactor: InteractorOptions<any, any, any>): void {
  let matching = findMatchesMatching(parentElement, interactor);

  if(matching.length !== 0) {
    let alternatives = matching.map((m) => '- ' + m.elementDescription());
    throw new NotAbsentError(`${description(interactor)} exists but should not:\n\n${alternatives.join('\n')}`);
  }
}

function ownDescription(options: InteractorOptions<any, any, any>): string {
  if(options.locator) {
    return `${options.name} ${options.locator.description} ${options.filter.description}`.trim();
  } else {
    return `${options.name} ${options.filter.description}`.trim();
  }
}

function description(options: InteractorOptions<any, any, any>): string {
  let ancestorsAndSelf: InteractorOptions<any, any, any>[] = options.ancestors.concat(options);
  return ancestorsAndSelf.reverse().map(ownDescription).join(' within ');
}

/**
 * Removes any default values for a filter from the lookup if that filter is present in the
 * assertion. Otherwise, it is not possible to make an assertion on a filter that might conflict
 * see https://github.com/thefrontside/bigtest/issues/966
*/
function getLookupFilterForAssertion<E extends Element, F extends Filters<E>>(filter: Filter<E, F>, filters: FilterParams<E, F>): Filter<E, F> {
  let lookupFilter = new Filter(filter.specification, Object.assign({}, filter.filters));
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

export function unsafeSyncResolveParent(options: InteractorOptions<any, any, any>): Element {
  return options.ancestors.reduce(resolveUnique, globals.document.documentElement);
}

export function unsafeSyncResolveUnique<E extends Element>(options: InteractorOptions<E, any, any>): E {
  return resolveUnique(unsafeSyncResolveParent(options), options) as E;
}

export function instantiateBaseInteractor<E extends Element, F extends Filters<E>, A extends Actions<E>>(
  options: InteractorOptions<E, F, A>,
  resolver: (options: InteractorOptions<E, F, A>) => E
): BaseInteractor<E, FilterParams<E, F>> & ActionMethods<E, A> {
  let interactor = {
    options,

    get description(): string {
      return description(options);
    },

    perform<T>(fn: (element: E) => T): Interaction<T> {
      return globals.wrapInteraction(
          interaction(`run perform on ${description(options)}`, () => converge(() => fn(resolver(options))))
      );
    },

    assert(fn: (element: E) => void): ReadonlyInteraction<void> {
      return check(`${this.description} asserts`, () => {
        return converge(() => {
          fn(resolver(options));
        });
      });
    },

    has(filters: FilterParams<E, F>): ReadonlyInteraction<void> {
      return interactor.is(filters);
    },

    is(filters: FilterParams<E, F>): ReadonlyInteraction<void> {
      let filter = new Filter(options.specification, filters);
      return check(`${this.description} matches filters: ${filter.description}`, () => {
        return converge(() => {
          let element = resolver({...options, filter: getLookupFilterForAssertion(options.filter, filters) });
          let match = new MatchFilter(element, filter);
          if(!match.matches) {
            throw new FilterNotMatchingError(`${description(options)} does not match filters:\n\n${match.formatAsExpectations()}`);
          }
        });
      });
    },
  }

  for(let [actionName, action] of Object.entries(options.specification.actions || {})) {
    if(!interactor.hasOwnProperty(actionName)) {
      Object.defineProperty(interactor, actionName, {
        value: function(...args: unknown[]) {
          let actionDescription = actionName;
          if(args.length) {
            actionDescription += ` with ` + args.map((a) => JSON.stringify(a)).join(', ');
          }
          return globals.wrapInteraction(
            interaction(`${actionDescription} on ${this.description}`, () => action(this, ...args))
          );
        },
        configurable: true,
        writable: true,
        enumerable: false,
      });
    }
  }

  for(let [filterName, filter] of Object.entries(options.specification.filters || {})) {
    if(!interactor.hasOwnProperty(filterName)) {
      Object.defineProperty(interactor, filterName, {
        value: function() {
          return interactionFilter(`${filterName} of ${this.description}`, async () => {
            return applyFilter(filter, resolver(options));
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

  return interactor as BaseInteractor<E, FilterParams<E, F>> & ActionMethods<E, A>;
}

export function instantiateInteractor<E extends Element, F extends Filters<E>, A extends Actions<E>>(
  options: InteractorOptions<E, F, A>,
): Interactor<E, FilterParams<E, F>> & ActionMethods<E, A> {
  let interactor = instantiateBaseInteractor(options, unsafeSyncResolveUnique)

  return Object.assign(interactor, {
    find<T extends Interactor<any, any>>(child: T): T {
      return instantiateInteractor({
        ...child.options,
        ancestors: [...options.ancestors, options, ...child.options.ancestors]
      }) as unknown as T;
    },

    exists(): ReadonlyInteraction<void> & FilterObject<boolean, Element> {
      return checkFilter(`${interactor.description} exists`, () => {
        return converge(() => {
          resolveNonEmpty(unsafeSyncResolveParent(options), options);
        });
      }, (element) => {
        return findMatchesMatching(element, options).length > 0;
      });
    },

    absent(): ReadonlyInteraction<void> & FilterObject<boolean, Element> {
      return checkFilter(`${interactor.description} does not exist`, () => {
        return converge(() => {
          resolveEmpty(unsafeSyncResolveParent(options), options);
        });
      }, (element) => {
        return findMatchesMatching(element, options).length === 0;
      });
    }
  });
}

export function createConstructor<E extends Element, FP extends FilterParams<any, any>, FM extends FilterMethods<any, any>, AM extends ActionMethods<any, any>>(
  name: string,
  specification: InteractorSpecification<E, any, any>,
): InteractorConstructor<E, FP, FM, AM> {
  function initInteractor(...args: any[]) {
    let locator, filter;
    let locatorValue = args[0] instanceof RegExp ? matching(args[0]) : args[0]
    if (typeof(locatorValue) === 'string' || isMatcher(locatorValue)) {
      locator = new Locator(specification.locator || defaultLocator, locatorValue);
      filter = new Filter(specification, args[1] || {});
    } else {
      filter = new Filter(specification, args[0] || {});
    }
    return instantiateInteractor({ name, specification, filter, locator, ancestors: [] });
  }

  return Object.assign(initInteractor, {
    selector: (value: string): InteractorConstructor<E, FP, FM, AM> => {
      return createConstructor(name, { ...specification, selector: value });
    },
    locator: (value: LocatorFn<E>): InteractorConstructor<E, FP, FM, AM> => {
      return createConstructor(name, { ...specification, locator: value });
    },
    filters: <FR extends Filters<E>>(filters: FR): InteractorConstructor<E, MergeObjects<FP, FilterParams<E, FR>>, MergeObjects<FM, FilterMethods<E, FR>>, AM> => {
      return createConstructor(name, { ...specification, filters: { ...specification.filters, ...filters } });
    },
    actions: <AR extends Actions<E>>(actions: AR): InteractorConstructor<E, FP, FM, MergeObjects<AM, ActionMethods<E, AR>>> => {
      return createConstructor(name, { ...specification, actions: Object.assign({}, specification.actions, actions) });
    },
    extend: <ER extends Element = E>(newName: string): InteractorConstructor<ER, FP, FM, AM> => {
      return createConstructor(newName, specification) as unknown as InteractorConstructor<ER, FP, FM, AM>;
    },
  }) as unknown as InteractorConstructor<E, FP, FM, AM>;
}
