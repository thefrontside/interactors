import { type Matcher, type MaybeMatcher, matcherDescription, applyMatcher, matcherCode, createMatcher } from "../matcher.ts";

export const or = createMatcher(
  'or',
  <T>(...args: MaybeMatcher<T>[]): Matcher<T> => ({
    match: (actual: T): boolean => args.some((matcher) => applyMatcher(matcher, actual)),
    description: (): string => args.map(matcherDescription).join(' or '),
    code: (): string => `or(${args.map((arg) => matcherCode(arg)).join(', ')})`,
  })
)
