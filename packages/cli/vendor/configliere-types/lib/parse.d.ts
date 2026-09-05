import type { AnyRoute, Input, Parse } from "./types.d.ts";
export declare function parse<const R extends AnyRoute>(route: R, input: Input): Parse<R>;
