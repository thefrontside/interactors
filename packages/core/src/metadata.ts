import type { Matcher } from "./matcher.ts";
import type { InteractorConstructor } from "./specification.ts";

/**
 * Version of the metadata attached to interactor and matcher constructors.
 *
 * Consumers should use the helpers in this module instead of reading the
 * symbol properties directly.
 */
export const CONSTRUCTOR_METADATA_VERSION = 1 as const;

/** @internal */
export const INTERACTOR_CONSTRUCTOR_METADATA = Symbol.for(
  "@interactors/core/interactor-constructor-metadata",
);

/** @internal */
export const MATCHER_CONSTRUCTOR_METADATA = Symbol.for(
  "@interactors/core/matcher-constructor-metadata",
);

export interface InteractorConstructorMetadata {
  readonly kind: "interactor";
  readonly version: typeof CONSTRUCTOR_METADATA_VERSION;
  readonly name: string;
  readonly actions: readonly string[];
  readonly filters: readonly string[];
}

export interface MatcherConstructorMetadata {
  readonly kind: "matcher";
  readonly version: typeof CONSTRUCTOR_METADATA_VERSION;
  readonly name: string;
}

type AnyInteractorConstructor = InteractorConstructor<
  Element,
  any,
  any,
  any
>;

type AnyMatcherConstructor = (...args: any[]) => Matcher<any>;

/**
 * Return stable, serializable metadata for an interactor constructor.
 */
export function getInteractorConstructorMetadata(
  value: unknown,
): InteractorConstructorMetadata | undefined {
  if (typeof value !== "function") {
    return undefined;
  }

  let metadata = Reflect.get(value, INTERACTOR_CONSTRUCTOR_METADATA);

  return isInteractorConstructorMetadata(metadata) ? metadata : undefined;
}

/**
 * Determine whether a value was created by {@link createInteractor}.
 *
 * The brand uses the global symbol registry so this works when the producer
 * and consumer load different copies of `@interactors/core`.
 */
export function isInteractorConstructor(
  value: unknown,
): value is AnyInteractorConstructor {
  return getInteractorConstructorMetadata(value) !== undefined;
}

/**
 * Return stable, serializable metadata for a matcher constructor.
 */
export function getMatcherConstructorMetadata(
  value: unknown,
): MatcherConstructorMetadata | undefined {
  if (typeof value !== "function") {
    return undefined;
  }

  let metadata = Reflect.get(value, MATCHER_CONSTRUCTOR_METADATA);

  return isMatcherConstructorMetadata(metadata) ? metadata : undefined;
}

/** Determine whether a value was created by {@link createMatcher}. */
export function isMatcherConstructor(
  value: unknown,
): value is AnyMatcherConstructor {
  return getMatcherConstructorMetadata(value) !== undefined;
}

/** @internal */
export function defineInteractorConstructorMetadata(
  constructor: Function,
  metadata: Omit<InteractorConstructorMetadata, "kind" | "version">,
): void {
  defineMetadata(constructor, INTERACTOR_CONSTRUCTOR_METADATA, {
    kind: "interactor",
    version: CONSTRUCTOR_METADATA_VERSION,
    name: metadata.name,
    actions: Object.freeze([...metadata.actions].sort()),
    filters: Object.freeze([...metadata.filters].sort()),
  });
}

/** @internal */
export function defineMatcherConstructorMetadata(
  constructor: Function,
  metadata: Omit<MatcherConstructorMetadata, "kind" | "version">,
): void {
  defineMetadata(constructor, MATCHER_CONSTRUCTOR_METADATA, {
    kind: "matcher",
    version: CONSTRUCTOR_METADATA_VERSION,
    name: metadata.name,
  });
}

function defineMetadata(
  constructor: Function,
  key: symbol,
  metadata: InteractorConstructorMetadata | MatcherConstructorMetadata,
): void {
  Object.defineProperty(constructor, key, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: Object.freeze(metadata),
  });
}

function isInteractorConstructorMetadata(
  value: unknown,
): value is InteractorConstructorMetadata {
  if (!isRecord(value)) {
    return false;
  }

  return value.kind === "interactor" &&
    value.version === CONSTRUCTOR_METADATA_VERSION &&
    typeof value.name === "string" &&
    isStringArray(value.actions) &&
    isStringArray(value.filters);
}

function isMatcherConstructorMetadata(
  value: unknown,
): value is MatcherConstructorMetadata {
  if (!isRecord(value)) {
    return false;
  }

  return value.kind === "matcher" &&
    value.version === CONSTRUCTOR_METADATA_VERSION &&
    typeof value.name === "string";
}

function isRecord(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) &&
    value.every((item) => typeof item === "string");
}
