import { type Matcher, createMatcher, matcherCode } from '../matcher.ts';

export const matching = createMatcher(
  'matching',
  (regexp: RegExp): Matcher<string> => ({
    match: (actual: string): boolean => actual.match(regexp) != null,
    description: (): string => `matching ${regexp}`,
    code: (): string => `matching(${matcherCode(regexp)})`
  })
)
