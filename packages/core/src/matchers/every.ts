import { Matcher, MaybeMatcher, applyMatcher, matcherDescription, matcherCode, createMatcher } from '../matcher';

export const every = createMatcher(
  <T>(expected: MaybeMatcher<T>): Matcher<Iterable<T>> => ({
    match: (actual: Iterable<T>): boolean => Array.from(actual).every((value) => applyMatcher(expected, value)),
    description: (): string => `every item ${matcherDescription(expected)}`,
    code: (): string => `every(${matcherCode(expected)})`
  })
)
