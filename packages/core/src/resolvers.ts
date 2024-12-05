
/* eslint-disable @typescript-eslint/no-explicit-any */

import { globals } from '@interactors/globals';
import { Match } from './match.ts';
import { NoSuchElementError, NotAbsentError, AmbiguousElementError } from './errors.ts';
import { formatDescription, formatMatchesTable } from './format.ts';
import type { InteractorOptions } from './specification.ts';

const defaultSelector = 'div';

export function findElements<E extends Element>(parentElement: Element, interactor: InteractorOptions<any, any, any>): E[] {
  if (!interactor.name) {
    throw new Error('One of your interactors was created without a name. Please provide a label for your interactor:\n\tHTML.extend(\'my interactor\') || createInteractor(\'my interactor\')');
  }
  if (typeof interactor.specification.selector === 'function') {
    return interactor.specification.selector(parentElement);
  } else if (interactor.specification.selector === ':root') {
    // this is a bit of a hack, because otherwise there isn't a good way of selecting the root element
    return [parentElement.ownerDocument.querySelector(':root') as E];
  } else {
    return Array.from(parentElement.querySelectorAll(interactor.specification.selector || defaultSelector));
  }
}

function findMatches(parentElement: Element, interactor: InteractorOptions<any, any, any>): Match<Element, any>[] {
  return findElements(parentElement, interactor).map((e) => new Match(e, interactor.filter, interactor.locator));
}

function throwNoSuchElementError(matches: Match<Element, any>[], interactor: InteractorOptions<any, any, any>): never {
  if (matches.length === 0) {
    throw new NoSuchElementError(`did not find ${formatDescription(interactor)}`);
  } else {
    throw new NoSuchElementError(`did not find ${formatDescription(interactor)}, did you mean one of:\n\n${formatMatchesTable(interactor, matches)}`);
  }
}

function findFirstMatch(parentElement: Element, interactor: InteractorOptions<any, any, any>): Match<Element, any> {
  let matches: Match<Element, any>[] = []
  for (let element of findElements(parentElement, interactor)) {
    let match = new Match(element, interactor.filter, interactor.locator)
    matches.push(match)
    if (match.matches) {
      return match
    }
  }
  throwNoSuchElementError(matches, interactor);
}

export function hasMatchMatching(parentElement: Element, interactor: InteractorOptions<any, any, any>): boolean {
  return findElements(parentElement, interactor).some(element => new Match(element, interactor.filter, interactor.locator).matches);
}

function findMatchesNonEmpty(parentElement: Element, interactor: InteractorOptions<any, any, any>): Match<Element, any>[] {
  let matches = findMatches(parentElement, interactor);
  let matching = matches.filter((m) => m.matches);
  if (matching.length > 0) {
    return matching;
  }
  throwNoSuchElementError(matches, interactor);
}

// Given a parent element, and an interactor, find exactly one matching element
// and return it. If no elements match, raise an error. If more than one
// element matches, raise an error.
export function resolveUnique(parentElement: Element, interactor: InteractorOptions<any, any, any>): Element {
  let matching = findMatchesNonEmpty(parentElement, interactor);

  if (matching.length === 1) {
    return matching[0].element;
  } else {
    let alternatives = matching.map((m) => '- ' + m.elementDescription());
    throw new AmbiguousElementError(`${formatDescription(interactor)} matches multiple elements:\n\n${alternatives.join('\n')}`);
  }
}

// Given a parent element, and an interactor, find the first matching element and
// return it. If no elements match, raise an error.
export function resolveFirst(parentElement: Element, interactor: InteractorOptions<any, any, any>): Element {
  return findFirstMatch(parentElement, interactor).element
}

// Given a parent element, and an interactor, check if there are any matching
// elements, and throw an error if there are. Otherwise return undefined.
export function resolveEmpty(parentElement: Element, interactor: InteractorOptions<any, any, any>): void {
  let matching = findMatches(parentElement, interactor).filter((m) => m.matches)

  if (matching.length !== 0) {
    let alternatives = matching.map((m) => '- ' + m.elementDescription());
    throw new NotAbsentError(`${formatDescription(interactor)} exists but should not:\n\n${alternatives.join('\n')}`);
  }
}

export function unsafeSyncResolveParent(options: InteractorOptions<any, any, any>): Element {
  return options.ancestors.reduce(resolveUnique, globals.document.documentElement);
}

export function unsafeSyncResolveUnique<E extends Element>(options: InteractorOptions<E, any, any>): E {
  return resolveUnique(unsafeSyncResolveParent(options), options) as E;
}
