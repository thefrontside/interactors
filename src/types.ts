// NOTE:
export interface DatePickerUtils {
  parse(value: string, format: string): Date | null;
  getMonth(value: Date | null): number;
}
