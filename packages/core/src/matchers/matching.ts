import { createMatcher, matcherCode } from '../matcher';
import { Matcher } from '../specification';

export const matching = createMatcher(
  'matching',
  (regexp: RegExp): Matcher<string> => ({
    match: (actual: string): boolean => actual.match(regexp) != null,
    description: (): string => `matching ${regexp}`,
    code: (): string => `matching(${matcherCode(regexp)})`
  })
)
