import type { FilterDefinition } from './specification.ts';
import { matcherDescription, type MaybeMatcher } from './matcher.ts';
import { applyFilter } from './match.ts';

export class Locator<E extends Element> {
  constructor(private definition: FilterDefinition<string, E>, public value: MaybeMatcher<string>) {}

  get description(): string {
    return matcherDescription(this.value);
  }

  apply(element: E): string {
    return applyFilter(this.definition, element);
  }
}

export const defaultLocator: FilterDefinition<string, Element> = (element) => element.textContent || "";
