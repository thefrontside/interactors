import { type Param } from "./param.d.ts";
import { type Check, type Fold, type ParamElement, type Unary } from "./pipeline.d.ts";
import type { Definition } from "./types.d.ts";
export declare function option<const N extends string, const E extends readonly Unary[]>(named: Definition<N>, ...elements: E & Check<Param<N, unknown>, E>): ElementOf<N, Fold<Param<N, unknown>, E>>;
type ValueOf<P> = P extends Param<string, infer T> ? T : never;
type ElementOf<N extends string, P> = P extends Param<N, unknown> ? ParamElement<N, ValueOf<P>> : never;
export {};
