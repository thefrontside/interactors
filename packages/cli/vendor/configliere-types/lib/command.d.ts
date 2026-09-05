import type { Check, Fold, Materialize, Unary } from "./pipeline.d.ts";
import type { Definition, Done, Route } from "./types.d.ts";
export type CommandZero<N extends string = string> = Route<N, "help" | "execute", {}, [
], [
    Done<{}, []>
]>;
export declare function command<const N extends string, const E extends readonly Unary[]>(start: Definition<N>, ...elements: E & Check<CommandZero<N>, E>): Materialize<Fold<CommandZero<N>, E>>;
