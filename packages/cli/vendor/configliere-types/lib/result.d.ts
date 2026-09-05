import type { Issue } from "./types.d.ts";
export type Result<T> = {
    ok: true;
    value: T;
    issues?: readonly Issue[];
} | {
    ok: false;
    issues: readonly Issue[];
};
