import { FilterDefinition } from './specification';
import { matcherDescription, MaybeMatcher } from './matcher';
import { applyFilter } from './match';

export class Locator<E extends Element> {
  constructor(private definition: FilterDefinition<string, E>, public value: MaybeMatcher<string>) {}

  get description(): string {
    return matcherDescription(this.value);
  }

  apply(element: E): string {
    return applyFilter(this.definition, element);
  }
}
