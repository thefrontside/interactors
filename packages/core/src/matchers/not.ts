import { matcherDescription, applyMatcher, matcherCode, createMatcher } from '../matcher';
import { Matcher, MaybeMatcher } from '../specification';

export const not = createMatcher(
  'not',
  <T>(matcher: MaybeMatcher<T>): Matcher<T> => ({
    match: (actual: T): boolean => !applyMatcher(matcher, actual),
    description: (): string => `not ${matcherDescription(matcher)}`,
    code: (): string => `not(${matcherCode(matcher)})`
  })
)
