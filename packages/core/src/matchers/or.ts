import { Matcher, MaybeMatcher, matcherDescription, applyMatcher, matcherCode } from '../matcher';

export function or<T>(...args: MaybeMatcher<T>[]): Matcher<T> {
  return {
    match(actual: T): boolean {
      return args.some((matcher) => applyMatcher(matcher, actual));
    },
    description(): string {
      return args.map(matcherDescription).join(' or ');
    },
    code(): string {
      return `or(${args.map(arg => matcherCode(arg)).join(', ')})`
    }
  }
}
