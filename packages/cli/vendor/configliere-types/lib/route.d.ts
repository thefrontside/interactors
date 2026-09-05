import { type Check, type Fold, type Materialize, type MethodElement, type RoutesElement, type Unary } from "./pipeline.d.ts";
import type { AnyRoute, Definition, Done, Route } from "./types.d.ts";
export type RouteZero<N extends string = string> = Route<N, "help", {}, [
], [
    Done<{}, []>
]>;
export declare function route<const N extends string, const E extends readonly Unary[]>(start: Definition<N>, ...elements: E & Check<RouteZero<N>, E>): Materialize<Fold<RouteZero<N>, E>>;
export declare function version(semver: string): MethodElement<"version">;
export declare function executable(): MethodElement<"execute">;
export declare function routes<const C extends readonly AnyRoute[]>(...children: C): RoutesElement<C>;
