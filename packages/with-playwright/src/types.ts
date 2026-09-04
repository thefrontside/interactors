import type {
  InteractorConstructor,
  Matcher,
  MaybeMatcher,
} from "@interactors/core";

type Scalar = null | boolean | number | string;
type AnyFunction = (...args: any[]) => any;
type AnyInteractorConstructor = InteractorConstructor<any, any, any, any>;
type AnyMatcherConstructor = (...args: any[]) => Matcher<any>;

declare const remoteInteractorBrand: unique symbol;
declare const remoteMatcherBrand: unique symbol;

/** A matcher value whose implementation runs inside the browser agent. */
export type RemoteMatcher<in T> = {
  readonly [remoteMatcherBrand]: (actual: T) => void;
};

export type RemoteMaybeMatcher<T> = RemoteInput<T> | RemoteMatcher<T>;

/** Values that can cross Playwright's page boundary. */
export type RemoteInput<T> = T extends Matcher<infer Actual>
  ? RemoteMatcher<Actual>
  : T extends RegExp ? RegExp
  : T extends Scalar ? T
  : T extends undefined | bigint | symbol | AnyFunction ? never
  : T extends readonly unknown[] ? RemoteArguments<T>
  : T extends object ? "$type" extends keyof T ? never
    : { [Key in keyof T]: RemoteInput<T[Key]> }
  : never;

type RemoteArguments<Args extends readonly unknown[]> = {
  [Key in keyof Args]: RemoteInput<Args[Key]>;
};

type WidenLiteral<T> = T extends string ? string
  : T extends number ? number
  : T extends boolean ? boolean
  : T;

type ForbiddenInstanceKey =
  | "perform"
  | "assert"
  | "options"
  | "apply"
  | "find"
  | "description";

type RemoteMethod<Method> = Method extends (...args: infer Args) => infer Result
  ? Result extends PromiseLike<infer Value>
    ? (...args: RemoteArguments<Args>) => Promise<Awaited<Value>>
  : never
  : never;

type RemoteMethods<Instance, ExcludedKey extends PropertyKey = never> = {
  [
    Key in keyof Instance as Key extends ForbiddenInstanceKey | ExcludedKey
      ? never
      : Instance[Key] extends (...args: any[]) => PromiseLike<any> ? Key
      : never
  ]: RemoteMethod<Instance[Key]>;
};

type RemoteFilterKey<Constructor extends AnyInteractorConstructor> =
  Constructor extends InteractorConstructor<any, infer Filters, any, any>
    ? keyof Filters
    : never;

interface AnyRemoteInteractor {
  readonly [remoteInteractorBrand]: true;
}

export type RemoteInteractor<
  Constructor extends AnyInteractorConstructor,
> =
  & AnyRemoteInteractor
  & RemoteMethods<ReturnType<Constructor>, RemoteFilterKey<Constructor>>
  & {
    find<Child extends AnyRemoteInteractor>(interactor: Child): Child;
  };

type RemoteInteractorConstructor<
  Constructor extends AnyInteractorConstructor,
> = Constructor extends InteractorConstructor<any, infer Filters, any, any> ? {
    (filters?: RemoteInput<Filters>): RemoteInteractor<Constructor>;
    (
      locator: string | RegExp | RemoteMatcher<string>,
      filters?: RemoteInput<Filters>,
    ): RemoteInteractor<Constructor>;
  }
  : never;

type RemoteConcreteMatcherConstructor<Constructor> = Constructor extends
  (...args: infer Args) => Matcher<infer Actual>
  ? (...args: RemoteArguments<Args>) => RemoteMatcher<Actual>
  : never;

type RemoteMatcherConstructor<Constructor> = Constructor extends
  <T>(...args: MaybeMatcher<T>[]) => Matcher<T>
  ? <T>(...args: RemoteMaybeMatcher<T>[]) => RemoteMatcher<WidenLiteral<T>>
  : Constructor extends <T>(arg: MaybeMatcher<T>) => Matcher<Iterable<T>> ? <T>(
      arg: RemoteMaybeMatcher<T>,
    ) => RemoteMatcher<Iterable<WidenLiteral<T>>>
  : Constructor extends <T>(arg: MaybeMatcher<T>) => Matcher<T>
    ? <T>(arg: RemoteMaybeMatcher<T>) => RemoteMatcher<WidenLiteral<T>>
  : RemoteConcreteMatcherConstructor<Constructor>;

type RemoteDefinition<Definition> = Definition extends AnyInteractorConstructor
  ? RemoteInteractorConstructor<Definition>
  : Definition extends AnyMatcherConstructor
    ? RemoteMatcherConstructor<Definition>
  : never;

type RemoteMappedDefinitions<Definitions> = {
  readonly [
    Key in keyof Definitions as Definitions[Key] extends
      AnyInteractorConstructor ? Key
      : Definitions[Key] extends AnyMatcherConstructor ? Key
      : never
  ]: RemoteDefinition<Definitions[Key]>;
};

export interface RemoteBuiltinMatchers {
  and<T>(...args: RemoteMaybeMatcher<T>[]): RemoteMatcher<WidenLiteral<T>>;
  or<T>(...args: RemoteMaybeMatcher<T>[]): RemoteMatcher<WidenLiteral<T>>;
  not<T>(arg: RemoteMaybeMatcher<T>): RemoteMatcher<WidenLiteral<T>>;
  every<T>(
    arg: RemoteMaybeMatcher<T>,
  ): RemoteMatcher<Iterable<WidenLiteral<T>>>;
  some<T>(
    arg: RemoteMaybeMatcher<T>,
  ): RemoteMatcher<Iterable<WidenLiteral<T>>>;
  including(substring: string): RemoteMatcher<string>;
  matching(regexp: RegExp): RemoteMatcher<string>;
}

/** Browser-backed versions of the constructors exported by `interactors.d.ts`. */
export type RemoteDefinitions<Definitions> =
  & Omit<RemoteBuiltinMatchers, keyof Definitions>
  & RemoteMappedDefinitions<Definitions>;
