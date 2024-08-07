import { type Matcher, matcherCode} from '../matcher.ts';

export function including(subString: string): Matcher<string> {
  return {
    match(actual: string): boolean {
      return actual.includes(subString);
    },
    description(): string {
      return `including ${JSON.stringify(subString)}`;
    },
    code(): string {
      return `including(${matcherCode(subString)})`
    }
  }
}
