import { applyMatcher, matcherDescription, matcherCode, createMatcher } from '../matcher';
import { Matcher, MaybeMatcher } from '../specification';

export const some = createMatcher(
  'some',
  <T>(expected: MaybeMatcher<T>): Matcher<Iterable<T>> => ({
    match: (actual: Iterable<T>): boolean => Array.from(actual).some((value) => applyMatcher(expected, value)),
    description: (): string => `some item ${matcherDescription(expected)}`,
    code: (): string => `some(${matcherCode(expected)})`
  })
)
