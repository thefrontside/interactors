import { type Matcher, type MaybeMatcher, matcherDescription, applyMatcher, matcherCode, createMatcher } from "../matcher.ts";

export const every = createMatcher(
  <T>(expected: MaybeMatcher<T>): Matcher<Iterable<T>> => ({
    match: (actual: Iterable<T>): boolean => Array.from(actual).every((value) => applyMatcher(expected, value)),
    description: (): string => `every item ${matcherDescription(expected)}`,
    code: (): string => `every(${matcherCode(expected)})`
  })
)
