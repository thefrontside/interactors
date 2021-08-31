import { InteractorConstructor } from "@interactors/html";

/**
 * Helper functions from `@date-io/*` utils
 */
export interface DatePickerUtils {
  parse(value: string, format: string): Date | null;
  getMonth(value: Date | null): number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetElementType<I extends InteractorConstructor<any, any, any>> = I extends InteractorConstructor<
  infer E,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>
  ? E
  : unknown;
