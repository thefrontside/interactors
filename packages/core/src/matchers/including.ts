import { type Matcher, createMatcher, matcherCode} from "../matcher.ts";

export const including = createMatcher(
  'including',
  (subString: string): Matcher<string> => ({
    match: (actual: string): boolean => actual.includes(subString),
    description: (): string => `including ${JSON.stringify(subString)}`,
    code: (): string => `including(${matcherCode(subString)})`
  })
)
