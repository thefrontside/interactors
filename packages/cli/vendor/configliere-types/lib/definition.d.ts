import { type IdentityElement } from "./pipeline.d.ts";
import type { Definition } from "./types.d.ts";
export declare function name<N extends string>(name: N): Definition<N>;
export declare function description(description: string): IdentityElement<Definition<string>>;
