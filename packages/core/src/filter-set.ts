import type { Filters, FilterFn, FilterObject, FilterParams, InteractorSpecification } from './specification.ts';
import { noCase } from 'change-case';
import { type MaybeMatcher, matcherDescription } from './matcher.ts';

export function filtersDescription(filters: Record<string, MaybeMatcher<unknown>>) {
  let entries = Object.entries(filters);
    if(entries.length === 0) {
      return '';
    } else {
      return entries.map(([key, value]) => {
        if(typeof(value) === 'boolean') {
          if(value) {
            return `which is ${noCase(key)}`;
          } else {
            return `which is not ${noCase(key)}`;
          }
        } else {
          return `with ${noCase(key)} ${matcherDescription(value)}`
        }
      }).join(' and ');
    }
}

export class FilterSet<E extends Element, F extends Filters<E>> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public specification: InteractorSpecification<E, F, any>,
    public filters: FilterParams<E, F>,
  ) {};

  get description(): string {
    return filtersDescription(this.filters);
  }

  get all(): FilterParams<E, F> {
    let filter: Record<string, unknown> = Object.assign({}, this.filters);
    for(let key in this.specification.filters) {
      let definition = this.specification.filters[key] as FilterFn<unknown, E> | FilterObject<unknown, E>;
      if(!(key in this.filters) && typeof(definition) !== 'function' && 'default' in definition) {
        filter[key] = definition.default;
      }
    }
    return filter as FilterParams<E, F>;
  }

  asTableHeader(): string[] {
    return Object.entries(this.all).map(([key, value]) => `${key}: ${matcherDescription(value)}`);
  }
}
