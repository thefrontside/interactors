import type { Envs } from "./env.d.ts";
import type { Symbol } from "./read.d.ts";
import type { Tokenizer } from "./tokenizer.d.ts";
import type { Values } from "./values.d.ts";
export interface Rest {
    readonly tokens: Tokenizer<Symbol>;
    readonly values: Values;
    readonly envs: Envs;
}
