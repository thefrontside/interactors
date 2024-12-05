import { type Matcher, type MaybeMatcher, applyMatcher, matcherDescription, matcherCode, createMatcher } from "../matcher.ts";

export const some = createMatcher(
  'some',
  <T>(expected: MaybeMatcher<T>): Matcher<Iterable<T>> => ({
    match: (actual: Iterable<T>): boolean => Array.from(actual).some((value) => applyMatcher(expected, value)),
    description: (): string => `some item ${matcherDescription(expected)}`,
    code: (): string => `some(${matcherCode(expected)})`
  })
)
