import type { AnyRoute } from "./types.d.ts";
import { type AnyElement, type DynamicElement } from "./pipeline.d.ts";
export type { ConjoinPhases, Seed } from "./pipeline.d.ts";
export type PhaseOf<R extends AnyRoute> = R["phases"][0];
export type PhasesOf<R extends AnyRoute> = R["phases"];
export declare function dynamic<Requirement, E>(extension: (requires: Requirement) => E, ..._valid: E extends AnyElement ? [] : [never]): DynamicElement<Requirement, Extract<E, AnyElement>>;
