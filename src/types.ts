import { InteractorConstructor } from "bigtest";

/**
 * Helper functions from `@date-io/*` utils
 */
export interface DatePickerUtils {
  parse(value: string, format: string): Date | null;
  getMonth(value: Date | null): number;
}

export type GetElementType<I extends InteractorConstructor<any, any, any>> = I extends InteractorConstructor<
  infer E,
  any,
  any
>
  ? E
  : unknown;
