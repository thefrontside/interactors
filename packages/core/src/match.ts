import type { Locator } from './locator.ts';
import type { FilterSet } from './filter-set.ts';
import type { Filters, FilterDefinition } from './specification.ts';
import { escapeHtml } from './escape-html.ts';
import { type MaybeMatcher, applyMatcher, matcherDescription } from './matcher.ts';

const check = (value: unknown): string => value ? "✓" : "⨯";

export class Match<E extends Element, F extends Filters<E>> {
  public matchLocator?: MatchLocator<E>;
  public matchFilter: MatchFilter<E, F>;

  constructor(
    public element: E,
    public filterSet: FilterSet<E, F>,
    public locator?: Locator<E>,
  ) {
    this.matchLocator = locator && new MatchLocator(element, locator);
    this.matchFilter = new MatchFilter(element, filterSet);
  }

  get matches(): boolean {
    return (this.matchLocator ? this.matchLocator.matches : true) && this.matchFilter.matches;
  }

  asTableHeader(name: string): string[] {
    if(this.matchLocator) {
      return [name, ...this.filterSet.asTableHeader()];
    } else {
      return this.filterSet.asTableHeader();
    }
  }

  asTableRow(): string[] {
    if(this.matchLocator) {
      return [this.matchLocator.description(), ...this.matchFilter.asTableRow()]
    } else {
      return this.matchFilter.asTableRow();
    }
  }

  get sortWeight(): number {
    return (this.matchLocator?.sortWeight || 0) + this.matchFilter.sortWeight;
  }

  elementDescription(): string {
    let tag = this.element.tagName.toLowerCase();
    let attrs = Array.from(this.element.attributes).map((attr) => {
      return `${attr.name}="${escapeHtml(attr.value)}"`
    });
    return `<${[tag, ...attrs].join(' ')}>`;
  }
}

export class MatchLocator<E extends Element> {
  public expected: MaybeMatcher<string> | null;
  public actual: string | null;

  constructor(
    public element: E,
    public locator: Locator<E>,
  ) {
    this.expected = locator.value;
    this.actual = locator.apply(element);
  }

  get matches(): boolean {
    return applyMatcher(this.expected, this.actual)
  }

  formatActual(): string {
    return JSON.stringify(this.actual);
  }

  description(): string {
    return `${check(this.matches)} ${this.formatActual()}`;
  }

  get sortWeight(): number {
    return this.matches ? 10 : 0;
  }
}

export class MatchFilter<E extends Element, F extends Filters<E>> {
  public items: MatchFilterItem<unknown, E, F>[];

  constructor(
    public element: E,
    public filter: FilterSet<E, F>,
  ) {
    this.items = Object.entries(filter.all).map(([key, expected]) => {
      return new MatchFilterItem(element, filter, key, expected)
    });
  }

  get matches(): boolean {
    return this.items.every((match) => match.matches)
  }

  asTableRow(): string[] {
    return this.items.map((f) => f.description());
  }

  get sortWeight(): number {
    return this.items.reduce((agg, i) => agg + i.sortWeight, 0);
  }

  formatAsExpectations(): string {
    return this.items.filter((i) => !i.matches).map((i) => i.formatAsExpectation()).join('\n\n');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyFilter<T>(definition: FilterDefinition<T, any>, element: Element): T {
  if(typeof(definition) === 'function') {
    return definition(element) as T;
  } else {
    return definition.apply(element) as T;
  }
}

export class MatchFilterItem<T, E extends Element, F extends Filters<E>> {
  constructor(
    public element: E,
    public filter: FilterSet<E, F>,
    public key: string,
    public expected: MaybeMatcher<T>,
  ) {}

  get matches(): boolean {
    return applyMatcher(this.expected, this.actual);
  }

  get actual(): T {
    if (this.filter.specification.filters && this.filter.specification.filters[this.key]) {
      let definition = this.filter.specification.filters[this.key];
      if (typeof definition === 'function') {
        return definition(this.element) as T;
      } else {
        return definition.apply(this.element) as T;
      }
    } else {
      throw new Error(`interactor does not define a filter named ${JSON.stringify(this.key)}`);
    }
  }

  formatActual(): string {
    return JSON.stringify(this.actual);
  }

  formatExpected(): string {
    return matcherDescription(this.expected);
  }

  description(): string {
    return `${check(this.matches)} ${this.formatActual()}`;
  }

  formatAsExpectation(): string {
    return [
      `╒═ Filter:   ${this.key}`,
      `├─ Expected: ${this.formatExpected()}`,
      `└─ Received: ${this.formatActual()}`,
    ].join('\n')
  }

  get sortWeight(): number {
    return this.matches ? 1 : 0;
  }
}
