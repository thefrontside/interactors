import type { AnyToken } from "./tokenize.d.ts";
export interface TokenInput<T extends AnyToken> extends Iterable<T> {
    claimNext(): Claim<T>;
    claimOne<S extends T>(match: (token: T) => token is S): Claim<S, T>;
    claimOne(match: (token: T) => boolean): Claim<T, T>;
    claimPair(match: (a: T, b: T) => boolean): Claim<T, T>;
    claimAll<S extends T>(match: (token: T) => token is S): Claim<S, T>;
    claimAll(match: (token: T) => boolean): Claim<T, T>;
}
export interface TokenRange {
    readonly start: number;
    readonly end?: number;
}
export interface ViewOptions {
    readonly range: TokenRange;
    readonly through?: number;
}
export declare class Tokenizer<T extends AnyToken> implements TokenInput<T> {
    readonly tokens: readonly T[];
    readonly claimed: ReadonlySet<number>;
    constructor(tokens: readonly T[], claimed?: ReadonlySet<number>);
    claimNext(): Claim<T>;
    claimOne<S extends T>(match: (token: T) => token is S): Claim<S, T>;
    claimOne(match: (token: T) => boolean): Claim<T, T>;
    claimPair(match: (a: T, b: T) => boolean): Claim<T, T>;
    claimAll<S extends T>(match: (token: T) => token is S): Claim<S, T>;
    claimAll(match: (token: T) => boolean): Claim<T, T>;
    view(options: ViewOptions): TokenInput<T>;
    [Symbol.iterator](): Generator<T, void, unknown>;
}
export interface Claim<T extends AnyToken, R extends AnyToken = T> {
    tokens: T[];
    rest: Tokenizer<R>;
}
