import isEqual from 'lodash.isequal';
import { TMatcher } from './specification';

export interface Matcher<T> {
  match(actual: T): boolean;
  description(): string;
  code?(): string;
}

type GetType<M> = M extends Matcher<infer T> ? T : never;

export abstract class MatcherConstructor {
  static [Symbol.hasInstance](instance: () => Matcher<unknown>): boolean {
    return Matchers.has(instance);
  }
}

const Matchers = new WeakSet<() => Matcher<unknown>>();

export type MaybeMatcher<T> = Matcher<T> | T;

export function isMatcher<T>(value: MaybeMatcher<T>): value is Matcher<T> {
  return value && typeof (value as Matcher<T>).match === "function" &&
    typeof (value as Matcher<T>).description === "function";
}

export function isTMatcher<T>(value: T | TMatcher<T>): value is TMatcher<T> {
  return value && typeof (value as TMatcher<T>).typename === 'string' && typeof (value as TMatcher<T>).args === 'object';
}

export function matcherDescription<T>(value: MaybeMatcher<T>): string {
  if (isMatcher(value)) {
    return value.description();
  } else if (isTMatcher(value)) {
    return value.description;
  } else if (value instanceof RegExp) {
    return value.toString();
  } else {
    return JSON.stringify(value);
  }
}

export function applyMatcher<T>(value: MaybeMatcher<T>, actual: T): boolean {
  if (isMatcher(value)) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createMatcher<F extends (...args: any) => Matcher<any>, T extends GetType<ReturnType<F>>>(name: string, fn: F): F & { // eslint-disable-next-line @typescript-eslint/no-misused-new
  builder(transform: (matcher: TMatcher<T>) => TMatcher<T>): (...args: Parameters<F>) => TMatcher<T> } {
  Matchers.add(fn);

  return Object.assign(
    fn,
    {
      builder: (transform: (matcher: TMatcher<T>) => TMatcher<T> = x => x) => (...args: Parameters<F>) => transform({
        typename: name,
        get description() { return fn(...args).description() },
        args,
      })
    }
  )
}

export function isEqual(a: any, b: any) {
  if (a === b) return true;

  if (a && b && typeof a == "object" && typeof b == "object") {
    if (a.constructor !== b.constructor) return false;

    let length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;) {
        if (!isEqual(a[i], b[i])) return false;
      }
      return true;
    }

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    }

    for (i = length; i-- !== 0;) {
      let key = keys[i];

      if (!isEqual(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
}
