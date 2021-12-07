import { Matcher, matcherCode } from '../matcher';

export function matching(regexp: RegExp): Matcher<string> {
  return {
    match(actual: string): boolean {
      return actual.match(regexp) != null;
    },
    description(): string {
      return `matching ${regexp}`;
    },
    code(): string {
      return `matching(${matcherCode(regexp)})`
    }
  }
}
