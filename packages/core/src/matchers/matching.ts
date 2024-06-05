import { Matcher, createMatcher, matcherCode } from '../matcher';

export const matching = createMatcher(
  'matching',
  (regexp: RegExp): Matcher<string> => ({
    match: (actual: string): boolean => actual.match(regexp) != null,
    description: (): string => `matching ${regexp}`,
    code: (): string => `matching(${matcherCode(regexp)})`
  })
)
