import isEqual from 'lodash.isequal';

export interface Matcher<T> {
  match(actual: T): boolean;
  description(): string;
  code?(): string;
}

export type MaybeMatcher<T> = Matcher<T> | T;

export function isMatcher<T>(value: MaybeMatcher<T>): value is Matcher<T> {
  return value && typeof (value as Matcher<T>).match === 'function' && typeof (value as Matcher<T>).description === 'function';
}

export function matcherDescription<T>(value: MaybeMatcher<T>): string {
  if(isMatcher(value)) {
    return value.description();
  } else {
    return JSON.stringify(value);
  }
}

export function applyMatcher<T>(value: MaybeMatcher<T>, actual: T): boolean {
  if(isMatcher(value)) {
    return value.match(actual);
  } else {
    return isEqual(value, actual);
  }
}

export function matcherCode<T>(value: MaybeMatcher<T>): string {
  if (isMatcher(value) && value.code) {
    return value.code();
  } else if (value instanceof RegExp) {
    return value.toString();
  } else {
    return JSON.stringify(value);
  }
}
