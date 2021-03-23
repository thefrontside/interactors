import type { Matcher } from '@bigtest/interactor';

export function containing(expected: string[]) : Matcher<string[]> {
  return {
    match(actual) {
      return expected.every((item) => actual.includes(item))
    },
    format() {
      return `containing all of ${JSON.stringify(expected)}`
    }
  }
};