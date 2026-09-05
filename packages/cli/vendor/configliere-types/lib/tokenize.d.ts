export interface Token<T extends string> {
    type: T;
    index: number;
    text: string;
}
export type AnyToken = Word | Flag | Setter | Separator | Literal;
export interface Setter extends Token<"setter"> {
    nameText: string;
    valueText: string;
}
export interface Flag extends Token<"flag"> {
    flagText: string;
    flagType: "short" | "long";
}
export type Word = Token<"word">;
export interface Separator extends Token<"separator"> {
    readonly text: "--";
}
export type Literal = Token<"literal">;
export declare function tokenize(argv: string[]): readonly AnyToken[];
