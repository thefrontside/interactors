import { type Extension, type Unary } from "./pipeline.d.ts";
export declare function extend<const E extends readonly Unary[]>(...elements: E): Extension<E>;
