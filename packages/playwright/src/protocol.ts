export const AGENT_GLOBAL = "__interactors__" as const;
export const AGENT_PROTOCOL_VERSION = 1 as const;

export interface RegistryInteractor {
  readonly id: string;
  readonly name: string;
  readonly actions: readonly string[];
  readonly filters: readonly string[];
}

export interface RegistryMatcher {
  readonly id: string;
  readonly name: string;
}

export interface Registry {
  readonly protocolVersion: typeof AGENT_PROTOCOL_VERSION;
  readonly registryHash: string;
  readonly interactors: readonly RegistryInteractor[];
  readonly matchers: readonly RegistryMatcher[];
}

export interface WireRegExp {
  readonly $type: "regexp";
  readonly source: string;
  readonly flags?: string;
}

export interface WireMatcher {
  readonly $type: "matcher";
  readonly matcher: string;
  readonly args: readonly WireValue[];
}

export type WireValue =
  | null
  | boolean
  | number
  | string
  | WireRegExp
  | WireMatcher
  | readonly WireValue[]
  | { readonly [key: string]: WireValue };

export interface InteractorReference {
  readonly interactor: string;
  readonly locator?: WireValue;
  readonly filters?: Readonly<Record<string, WireValue>>;
}

export interface AgentCommand {
  readonly protocolVersion: number;
  readonly registryHash: string;
  readonly path: readonly InteractorReference[];
  readonly method: string;
  readonly args?: readonly WireValue[];
}

export interface AgentError {
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
}

export type AgentResult<T = unknown> =
  | { readonly ok: true; readonly value?: T }
  | { readonly ok: false; readonly error: AgentError };
