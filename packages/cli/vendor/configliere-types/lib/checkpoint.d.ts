import type { DynamicElement } from "./pipeline.d.ts";
import { type ValueSource, withValues } from "./values.d.ts";
export declare function checkpoint(): DynamicElement<ValueSource[], ReturnType<typeof withValues>>;
