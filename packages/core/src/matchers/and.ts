import { type Matcher, type MaybeMatcher, matcherDescription, applyMatcher, matcherCode } from '../matcher.ts';

export function and<T>(...args: MaybeMatcher<T>[]): Matcher<T> {
  return {
    match(actual: T): boolean {
      return args.every((matcher) => applyMatcher(matcher, actual));
    },
    description(): string {
      return args.map(matcherDescription).join(' and ');
    },
    code(): string {
      return `and(${args.map(arg => matcherCode(arg)).join(', ')})`
    }
  }
}
