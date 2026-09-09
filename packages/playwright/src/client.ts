import type {
  AgentCommand,
  InteractorReference,
  Registry,
  RegistryInteractor,
  WireValue,
} from "./protocol.ts";
import type { RemoteDefinitions } from "./types.ts";

export interface AgentTransport {
  run(command: AgentCommand): Promise<unknown>;
}

interface ClientRuntime {
  readonly registry: Registry;
  readonly transport: AgentTransport;
}

interface MatcherState {
  readonly runtime: ClientRuntime;
  readonly id: string;
  readonly args: readonly unknown[];
}

interface InteractorState {
  readonly runtime: ClientRuntime;
  readonly path: readonly InteractorReference[];
  readonly definition: RegistryInteractor;
}

const matcherState = Symbol("remote matcher");
const interactorState = Symbol("remote interactor");

export function createRemoteDefinitions<Definitions>(
  registry: Registry,
  transport: AgentTransport,
): RemoteDefinitions<Definitions> {
  let runtime = { registry, transport };
  let definitions = Object.create(null) as Record<string, unknown>;

  for (let definition of registry.interactors) {
    define(
      definitions,
      definition.id,
      createInteractorConstructor(runtime, definition),
    );
  }
  for (let definition of registry.matchers) {
    if (Object.hasOwn(definitions, definition.id)) {
      throw new Error(
        `Registry definition ${JSON.stringify(definition.id)} is duplicated`,
      );
    }
    define(
      definitions,
      definition.id,
      createMatcherConstructor(runtime, definition.id),
    );
  }

  return definitions as RemoteDefinitions<Definitions>;
}

function createInteractorConstructor(
  runtime: ClientRuntime,
  definition: RegistryInteractor,
): (...args: unknown[]) => unknown {
  let constructor = (...args: unknown[]) => {
    let reference = createReference(runtime, definition.id, args);
    return createInteractor(runtime, [reference], definition);
  };
  Object.defineProperty(constructor, "name", {
    configurable: true,
    value: definition.id,
  });
  return constructor;
}

function createMatcherConstructor(
  runtime: ClientRuntime,
  id: string,
): (...args: unknown[]) => unknown {
  let constructor = (...args: unknown[]) =>
    Object.freeze({
      [matcherState]: { runtime, id, args } satisfies MatcherState,
    });
  Object.defineProperty(constructor, "name", {
    configurable: true,
    value: id,
  });
  return constructor;
}

function createInteractor(
  runtime: ClientRuntime,
  path: readonly InteractorReference[],
  definition: RegistryInteractor,
): unknown {
  let interactor = Object.create(null) as Record<PropertyKey, unknown>;
  let state = { runtime, path, definition } satisfies InteractorState;
  Object.defineProperty(interactor, interactorState, { value: state });

  define(interactor, "find", (child: unknown) => {
    let childState = getInteractorState(child);
    if (!childState || childState.runtime !== runtime) {
      throw new TypeError(
        "find() expects an interactor created by the same loaded registry",
      );
    }
    return createInteractor(
      runtime,
      [...path, ...childState.path],
      childState.definition,
    );
  });

  for (
    let method of [
      "exists",
      "absent",
      "has",
      "is",
      ...definition.actions,
    ]
  ) {
    define(
      interactor,
      method,
      (...args: unknown[]) => invoke(state, method, args),
    );
  }

  return interactor;
}

async function invoke(
  state: InteractorState,
  method: string,
  args: readonly unknown[],
): Promise<unknown> {
  let command: AgentCommand = {
    protocolVersion: state.runtime.registry.protocolVersion,
    registryHash: state.runtime.registry.registryHash,
    path: state.path,
    method,
    ...(args.length > 0
      ? { args: args.map((arg) => encodeValue(arg, state.runtime)) }
      : {}),
  };
  let result = await state.runtime.transport.run(command);
  return unwrapResult(result);
}

function createReference(
  runtime: ClientRuntime,
  interactor: string,
  args: readonly unknown[],
): InteractorReference {
  if (args.length > 2) {
    throw new TypeError(
      `Interactor ${JSON.stringify(interactor)} accepts at most two arguments`,
    );
  }
  if (args.length === 0 || (args.length === 1 && args[0] === undefined)) {
    return { interactor };
  }

  let [first, second] = args;
  if (args.length === 1 && isFilterRecord(first)) {
    return { interactor, filters: encodeFilters(first, runtime) };
  }

  if (!isLocator(first)) {
    throw new TypeError(
      `Interactor ${
        JSON.stringify(interactor)
      } locator must be a string, RegExp, or remote matcher`,
    );
  }

  let reference: InteractorReference = {
    interactor,
    locator: encodeValue(first, runtime),
  };
  if (second !== undefined) {
    if (!isFilterRecord(second)) {
      throw new TypeError(
        `Interactor ${
          JSON.stringify(interactor)
        } filters must be a plain object`,
      );
    }
    reference = {
      ...reference,
      filters: encodeFilters(second, runtime),
    };
  }
  return reference;
}

function encodeFilters(
  filters: Record<string, unknown>,
  runtime: ClientRuntime,
): Record<string, WireValue> {
  let encoded = encodeValue(filters, runtime);
  if (
    encoded === null || typeof encoded !== "object" ||
    Array.isArray(encoded) || "$type" in encoded
  ) {
    throw new TypeError("Interactor filters must be a plain object");
  }
  return encoded as Record<string, WireValue>;
}

function encodeValue(
  value: unknown,
  runtime: ClientRuntime,
  ancestors = new Set<object>(),
): WireValue {
  if (
    value === null || typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("Interactor command numbers must be finite");
    }
    return value;
  }
  if (value instanceof RegExp) {
    return {
      $type: "regexp",
      source: value.source,
      ...(value.flags ? { flags: value.flags } : {}),
    };
  }

  let remoteMatcher = getMatcherState(value);
  if (remoteMatcher) {
    if (remoteMatcher.runtime !== runtime) {
      throw new TypeError(
        "Matcher was created by a different loaded registry",
      );
    }
    return {
      $type: "matcher",
      matcher: remoteMatcher.id,
      args: remoteMatcher.args.map((arg) =>
        encodeValue(arg, runtime, ancestors)
      ),
    };
  }

  if (Array.isArray(value)) {
    return encodeObject(
      value,
      ancestors,
      () => value.map((item) => encodeValue(item, runtime, ancestors)),
    );
  }
  if (isPlainObject(value)) {
    if (Object.hasOwn(value, "$type")) {
      throw new TypeError(
        'Interactor command objects cannot use the reserved "$type" property',
      );
    }
    return encodeObject(value, ancestors, () => {
      let encoded: Record<string, WireValue> = Object.create(null);
      for (let [key, item] of Object.entries(value)) {
        encoded[key] = encodeValue(item, runtime, ancestors);
      }
      return encoded;
    });
  }

  throw new TypeError(
    `Interactor commands cannot serialize ${describeValue(value)}`,
  );
}

function encodeObject<T extends WireValue>(
  value: object,
  ancestors: Set<object>,
  encode: () => T,
): T {
  if (ancestors.has(value)) {
    throw new TypeError("Interactor commands cannot serialize cyclic values");
  }
  ancestors.add(value);
  try {
    return encode();
  } finally {
    ancestors.delete(value);
  }
}

function unwrapResult(result: unknown): unknown {
  if (!isRecord(result) || typeof result.ok !== "boolean") {
    throw new TypeError("Interactor agent returned an invalid result");
  }
  if (result.ok === true) {
    return result.value;
  }
  if (
    !isRecord(result.error) || typeof result.error.name !== "string" ||
    typeof result.error.message !== "string" ||
    (result.error.stack !== undefined && typeof result.error.stack !== "string")
  ) {
    throw new TypeError("Interactor agent returned an invalid error result");
  }

  let error = new Error(result.error.message);
  error.name = result.error.name;
  if (result.error.stack) {
    error.stack = `${
      error.stack ?? `${error.name}: ${error.message}`
    }\n\nRemote browser stack:\n${result.error.stack}`;
  }
  throw error;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getMatcherState(value: unknown): MatcherState | undefined {
  return value !== null && typeof value === "object"
    ? (value as { [matcherState]?: MatcherState })[matcherState]
    : undefined;
}

function getInteractorState(value: unknown): InteractorState | undefined {
  return value !== null && typeof value === "object"
    ? (value as { [interactorState]?: InteractorState })[interactorState]
    : undefined;
}

function isLocator(value: unknown): boolean {
  return typeof value === "string" || value instanceof RegExp ||
    getMatcherState(value) !== undefined;
}

function isFilterRecord(value: unknown): value is Record<string, unknown> {
  return isPlainObject(value) && getMatcherState(value) === undefined;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") {
    return false;
  }
  let prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  if (typeof value === "object") {
    return Object.prototype.toString.call(value);
  }
  return typeof value;
}

function define(
  target: Record<PropertyKey, unknown>,
  name: PropertyKey,
  value: unknown,
): void {
  Object.defineProperty(target, name, {
    configurable: false,
    enumerable: true,
    writable: false,
    value,
  });
}
