/* eslint-disable @typescript-eslint/no-explicit-any */
import isEqual from 'lodash.isequal';
import { Matcher, TMatcher, MatcherConstructor, MaybeMatcher } from './specification';

type GetType<M> = M extends Matcher<infer T> ? T : never;

type GetMaybeType<M> = M extends MaybeMatcher<infer T> ? T : never;

type UnwrapArray<T> = T extends (infer U)[] ? U : never;

export function isMatcher<T>(value: MaybeMatcher<T>): value is Matcher<T> {
  return value && typeof (value as Matcher<T>).match === 'function' && typeof (value as Matcher<T>).description === 'function';
}

export function isTMatcher<T>(value: T | TMatcher<T>): value is TMatcher<T> {
  return value && typeof (value as TMatcher<T>).typename === 'string' && typeof (value as TMatcher<T>).args === 'object';
}

export function matcherDescription<T>(value: MaybeMatcher<T>): string {
  if(isMatcher(value)) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createMatcher<F extends (...args: any) => Matcher<any>, A extends GetType<ReturnType<F>>>(name: string, fn: F): MatcherConstructor<GetMaybeType<UnwrapArray<Parameters<F>>>, A> {
  return Object.assign(
    fn,
    {
      get [Symbol.toStringTag]() {
        return 'Matcher';
      },
      builder: () => (...args: GetMaybeType<UnwrapArray<Parameters<F>>>[]) => ({
        typename: name,
        get description() { return fn(...args).description() },
        args,
      })
    }
  ) as MatcherConstructor<GetMaybeType<UnwrapArray<Parameters<F>>>, A>;
}
