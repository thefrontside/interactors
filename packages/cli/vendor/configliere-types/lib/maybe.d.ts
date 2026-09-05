export type Maybe<T> = {
    readonly exists: false;
} | {
    readonly exists: true;
    readonly value: T;
};
export declare function Just(): Maybe<void>;
export declare function Just<T>(value: T): Maybe<T>;
export declare function Nothing<T = void>(): Maybe<T>;
