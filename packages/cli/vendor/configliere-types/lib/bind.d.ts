import type { Maybe } from "./maybe.d.ts";
import type { Param } from "./param.d.ts";
import type { Symbol } from "./read.d.ts";
import type { Rest } from "./rest.d.ts";
import type { Result } from "./result.d.ts";
import type { TokenInput, TokenRange } from "./tokenizer.d.ts";
import type { AnyPhase, Issue, Path } from "./types.d.ts";
export interface Binding<T> {
    readonly rest: Rest;
    readonly result: Result<T>;
}
export interface PhaseBinding {
    readonly rest: Rest;
    readonly model: Record<string, unknown>;
    readonly issues: Issue[];
    readonly valid: boolean;
}
export interface PhaseSegment {
    readonly range: TokenRange;
    readonly path: Path;
}
export declare function fromCLI<const K extends string, T>(options: {
    readonly param: Param<K, T>;
    readonly view: TokenInput<Symbol>;
    readonly rest: Rest;
}): Maybe<Binding<T>>;
export declare function fromValues<const K extends string, T>(options: {
    readonly param: Param<K, T>;
    readonly route: Path;
    readonly rest: Rest;
}): Maybe<Binding<T>>;
export declare function fromEnv<const K extends string, T>(options: {
    readonly param: Param<K, T>;
    readonly route: Path;
    readonly rest: Rest;
}): Maybe<Binding<T>>;
export declare function bindPhase(options: {
    readonly phase: AnyPhase;
    readonly segment: PhaseSegment;
    readonly rest: Rest;
}): PhaseBinding;
