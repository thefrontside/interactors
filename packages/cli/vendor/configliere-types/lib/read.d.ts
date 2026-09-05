import type { Maybe } from "./maybe.d.ts";
import type { Param } from "./param.d.ts";
import { type IdentityElement } from "./pipeline.d.ts";
import type { Result } from "./result.d.ts";
import type { Flag, Setter, Word } from "./tokenize.d.ts";
import type { Claim, TokenInput } from "./tokenizer.d.ts";
export type Symbol = Flag | Setter | Word;
export type ReadCLI = (tokens: TokenInput<Symbol>) => CLIRead;
export interface CLIBinding {
    readonly read: ReadCLI;
    readonly syntax?: CLISyntax;
}
export type CLISyntax = {
    readonly type: "argument";
    readonly label: string;
} | {
    readonly type: "option";
    readonly label: string;
};
export interface CLIRead {
    result: Result<Maybe<string | boolean>>;
    claim: Claim<Symbol>;
}
export interface CLIOptions {
    switch?: true;
}
export declare function cli(names: readonly string[], options?: CLIOptions): IdentityElement<Param<string, unknown>>;
