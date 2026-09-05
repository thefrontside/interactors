import { type Decoder } from "./decode.d.ts";
import { type Check, type Fold, type Transform, type TransformElement, type Unary } from "./pipeline.d.ts";
import type { CLIBinding } from "./read.d.ts";
import type { Definition, Schema } from "./types.d.ts";
export interface Param<K extends string, T> extends Definition<K> {
    schema: Schema<T>;
    cli: CLIBinding;
    decode: Decoder;
    env?: string;
}
export declare function param<const K extends string, const E extends readonly Unary[]>(start: Definition<K>, ...elements: E & Check<Param<K, unknown>, E>): Fold<Param<K, unknown>, E>;
export declare function schema<T>(schema: Schema<T>): TransformElement<SchemaTransform<T>>;
interface SchemaTransform<T> extends Transform {
    readonly input: Param<string, unknown>;
    readonly output: this["input"] extends Param<infer N, unknown> ? Param<N, T> : never;
}
export {};
