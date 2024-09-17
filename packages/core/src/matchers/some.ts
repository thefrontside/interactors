import { type Matcher, type MaybeMatcher, applyMatcher, matcherDescription, matcherCode } from '../matcher.ts';

export function some<T>(expected: MaybeMatcher<T>): Matcher<Iterable<T>> {
  return {
    match(actual: Iterable<T>): boolean {
      return Array.from(actual).some((value) => applyMatcher(expected, value));
    },
    description(): string {
      return `some item ${matcherDescription(expected)}`;
    },
    code(): string {
      return `some(${matcherCode(expected)})`
    }
  }
}
