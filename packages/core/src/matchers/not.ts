import { Matcher, MaybeMatcher, matcherDescription, applyMatcher, matcherCode } from '../matcher';

export function not<T>(matcher: MaybeMatcher<T>): Matcher<T> {
  return {
    match(actual: T): boolean {
      return !applyMatcher(matcher, actual);
    },
    description(): string {
      return `not ${matcherDescription(matcher)}`;
    },
    code(): string {
      return `not(${matcherCode(matcher)})`
    }
  }
}
