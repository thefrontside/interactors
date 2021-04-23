/**
 * Helper functions from `@date-io/*` utils
 */
export interface DatePickerUtils {
  parse(value: string, format: string): Date | null;
  getMonth(value: Date | null): number;
}
