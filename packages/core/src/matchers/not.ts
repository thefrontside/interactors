import { type Matcher, type MaybeMatcher, matcherDescription, applyMatcher, matcherCode, createMatcher } from "../matcher.ts";

export const not = createMatcher(
  <T>(matcher: MaybeMatcher<T>): Matcher<T> => ({
    match: (actual: T): boolean => !applyMatcher(matcher, actual),
    description: (): string => `not ${matcherDescription(matcher)}`,
    code: (): string => `not(${matcherCode(matcher)})`
  })
)
