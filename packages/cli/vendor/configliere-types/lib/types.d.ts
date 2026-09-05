import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { EnvSource } from "./env.d.ts";
import type { Literal } from "./tokenize.d.ts";
import type { Param } from "./param.d.ts";
import type { Result } from "./result.d.ts";
import type { ValueSource } from "./values.d.ts";
export type Issue = StandardSchemaV1.Issue;
export type Schema<T> = StandardSchemaV1<T, T>;
export interface Definition<N extends string> {
    readonly name: N;
    readonly description?: string;
}
export interface Route<N extends string, M extends Method, T extends object, C extends readonly AnyRoute[], P extends AnyPhases> extends Definition<N> {
    readonly methods: readonly M[];
    readonly version?: string;
    readonly phases: P;
    readonly model?: T;
    readonly children?: C;
}
export type Parse<R extends AnyRoute> = Outcome<ParseAt<R, "/", {}>>;
export type Phase<Model extends object, Routes extends readonly AnyRoute[], Requirement = never> = [Requirement] extends [never] ? Done<Model, Routes> : Next<Model, Routes, Requirement>;
export type Next<Model extends object, Routes extends readonly AnyRoute[], T> = {
    readonly params: Params<Model>;
    readonly routes: Routes;
    readonly values: readonly ValueSource[];
    readonly envs: readonly EnvSource[];
    readonly resolver: (requirement: T) => (input: AnyRoute) => AnyRoute;
};
export type Done<Model extends object, Routes extends readonly AnyRoute[]> = {
    readonly params: Params<Model>;
    readonly routes: Routes;
    readonly values: readonly ValueSource[];
    readonly envs: readonly EnvSource[];
};
export type Params<Model extends object> = {
    [K in keyof Model]: K extends string ? Param<K, Model[K]> : never;
};
export interface ParseIncrement<R extends AnyRoute, P extends RoutePath = "/", Models extends ModelsByRoute = {}> {
    readonly ok: true;
    readonly route: P;
    readonly model: IncrementModelOf<R>;
    resume(result: Result<RequirementOf<R>>): Outcome<ParseAt<ContinuationOf<R>, P, Models>>;
}
export type ContinuationOf<R extends AnyRoute> = R extends Route<string, Method, object, readonly AnyRoute[], readonly [
    AnyPhase,
    infer Next extends AnyPhase,
    ...infer Tail extends AnyPhase[]
]> ? Route<R["name"], R["methods"][number], ModelOf<R>, ChildrenOf<R>, readonly [Next, ...Tail]> : never;
export type ModelOf<R extends AnyRoute> = R extends Route<string, Method, infer T, readonly AnyRoute[], readonly [AnyPhase, ...readonly AnyPhase[]]> ? T : never;
export type ChildrenOf<R extends AnyRoute> = R extends Route<string, Method, object, infer Children, AnyPhases> ? Children : never;
export type RequirementsOf<R extends AnyRoute> = RequirementsIn<R["phases"]>;
export type RequirementOf<R extends AnyRoute> = RequirementIn<R["phases"][0]>;
export interface AnyRoute extends Definition<string> {
    readonly methods: readonly Method[];
    readonly version?: string;
    readonly phases: AnyPhases;
}
export interface AnyPhase {
    readonly params: Params<object>;
    readonly routes: readonly AnyRoute[];
    readonly values: readonly ValueSource[];
    readonly envs: readonly EnvSource[];
    readonly resolver?: (requirement: never) => (route: never) => AnyRoute;
}
export type AnyPhases = readonly [AnyPhase, ...AnyPhase[]];
export type Method = "help" | "version" | "execute";
export type MethodsOf<R extends AnyRoute> = R["methods"][number];
export type Path = readonly string[];
export type Input = {
    argv: string[];
    values?: readonly ValueSource[];
    envs?: readonly EnvSource[];
};
export interface Failure<C extends Status> {
    readonly ok: false;
    readonly code: C;
}
export type Outcome<T> = T | MethodNotAllowed | UnprocessableContent;
export type IntentsOf<R extends AnyRoute> = IntentsAt<R, `/`, {}>;
export type RoutePath = `/${string}`;
export type ModelsByRoute = {
    readonly [path: RoutePath]: object;
};
export type PathOf<R extends RoutePath> = R extends "/" ? [] : R extends `/${infer Rest}` ? Split<Rest> : never;
export type AnyIntent = Help<RoutePath> | Version<RoutePath> | Execute<RoutePath, ModelsByRoute>;
export type ChildIntents<C extends readonly AnyRoute[], P extends RoutePath, Models extends ModelsByRoute> = C extends readonly [
    infer Head extends AnyRoute,
    ...infer Tail extends readonly AnyRoute[]
] ? (IntentsAt<Head, Append<P, Head["name"]>, Models> | ChildIntents<Tail, P, Models>) : never;
export interface Intent<M extends Method, P extends RoutePath> {
    readonly ok: true;
    readonly method: M;
    readonly route: P;
    readonly definition: AnyRoute;
    readonly path: PathOf<P>;
    readonly literals: Iterable<Literal>;
}
export type Help<P extends RoutePath> = Intent<"help", P>;
export type Version<P extends RoutePath> = Intent<"version", P>;
export interface Execute<P extends RoutePath, Models extends ModelsByRoute> extends Intent<"execute", P> {
    readonly issues: readonly Issue[];
    readonly model: Models[P];
    readonly models: Models;
}
export type Status = "method-not-allowed" | "unprocessable-content";
export interface MethodNotAllowed extends Failure<"method-not-allowed"> {
    readonly route: string;
    readonly definition: AnyRoute;
    readonly path: Path;
    readonly method: Method;
    readonly allowed: readonly Method[];
}
export interface UnprocessableContent extends Failure<"unprocessable-content"> {
    readonly route: string;
    readonly definition: AnyRoute;
    readonly path: Path;
    readonly issues: Issue[];
}
type RequirementIn<P extends AnyPhase> = P extends {
    readonly resolver: (requirement: infer Requirement) => (route: AnyRoute) => AnyRoute;
} ? Requirement : never;
type IncrementModelOf<R extends AnyRoute> = R["phases"][0] extends Next<infer Model, readonly AnyRoute[], infer Requirement> ? Model : never;
type ParseAt<R extends AnyRoute, P extends RoutePath, Models extends ModelsByRoute> = [RequirementOf<R>] extends [never] ? (Help<P> | ("version" extends MethodsOf<R> ? Version<P> : never) | ("execute" extends MethodsOf<R> ? AddModel<Models, P, ModelOf<R>> extends infer Bound extends ModelsByRoute ? Execute<P, {
    [K in keyof Bound]: Bound[K];
}> : never : never) | ParseChildren<ChildrenOf<R>, P, AddModel<Models, P, ModelOf<R>>>) : ParseIncrement<R, P, {
    [K in keyof Models]: Models[K];
}>;
type ParseChildren<C extends readonly AnyRoute[], P extends RoutePath, Models extends ModelsByRoute> = C extends readonly [
    infer Head extends AnyRoute,
    ...infer Tail extends readonly AnyRoute[]
] ? (ParseAt<Head, Append<P, Head["name"]>, Models> | ParseChildren<Tail, P, Models>) : never;
type RequirementsIn<P extends readonly AnyPhase[]> = P extends readonly [
    infer Head extends AnyPhase,
    ...infer Tail extends AnyPhase[]
] ? [RequirementIn<Head>] extends [never] ? readonly [] : readonly [RequirementIn<Head>, ...RequirementsIn<Tail>] : readonly [];
type AddModel<Models extends ModelsByRoute, P extends RoutePath, T extends object> = {
    [K in keyof Models | P]: K extends P ? T : K extends keyof Models ? Models[K] : never;
};
type Split<S extends string> = string extends S ? Path : S extends `${infer Head}/${infer Tail}` ? [Head, ...Split<Tail>] : S extends "" ? [] : [S];
type Append<A extends RoutePath, N extends string> = A extends "/" ? `/${N}` : `${A}/${N}`;
type AddParam<P extends AnyPhase, K extends string, V> = P extends Next<infer Model, infer Routes, infer Requirement> ? Next<AddField<Model, K, V>, Routes, Requirement> : P extends Done<infer Model, infer Routes> ? Done<AddField<Model, K, V>, Routes> : never;
export type AddParamToLast<P extends AnyPhases, K extends string, V> = ReplaceLast<P, AddParam<LastOf<P>, K, V>>;
export type AddRoutesToLast<P extends AnyPhases, C extends readonly AnyRoute[]> = ReplaceLast<P, AddRoutes<LastOf<P>, C>>;
type LastOf<P extends AnyPhases> = P extends readonly [
    ...AnyPhase[],
    infer Last extends AnyPhase
] ? Last : never;
type ReplaceLast<P extends AnyPhases, Last extends AnyPhase> = P extends readonly [AnyPhase] ? readonly [Last] : P extends readonly [
    infer First extends AnyPhase,
    ...infer Middle extends AnyPhase[],
    AnyPhase
] ? readonly [First, ...Middle, Last] : never;
type AddRoutes<Phase extends AnyPhase, Added extends readonly AnyRoute[]> = Phase extends Next<infer Model, infer Routes, infer Requirement> ? Next<Model, readonly [...Routes, ...Added], Requirement> : Phase extends Done<infer Model, infer Routes> ? Done<Model, readonly [...Routes, ...Added]> : never;
export type AddField<T extends object, K extends string, V> = Simplify<Omit<T, K> & {
    [P in K]: V;
}>;
type Simplify<T> = {
    [P in keyof T]: T[P];
};
type IntentsAt<R extends AnyRoute, P extends RoutePath, Models extends ModelsByRoute> = Help<P> | ("version" extends MethodsOf<R> ? Version<P> : never) | ("execute" extends MethodsOf<R> ? AddModel<Models, P, ModelOf<R>> extends infer Bound extends ModelsByRoute ? Execute<P, {
    [K in keyof Bound]: Bound[K];
}> : never : never) | ChildIntents<ChildrenOf<R>, P, AddModel<Models, P, ModelOf<R>>>;
export {};
