import { type Matcher, type MaybeMatcher, matcherDescription, applyMatcher, matcherCode, createMatcher } from "../matcher.ts";

export const and = createMatcher(
  <T>(...args: MaybeMatcher<T>[]): Matcher<T> => ({
    match: (actual: T): boolean => args.every((matcher) => applyMatcher(matcher, actual)),
    description: (): string => args.map(matcherDescription).join(" and "),
    code: (): string => `and(${args.map((arg) => matcherCode(arg)).join(", ")})`,
  })
);
