import { Select, MultiSelect } from "bigtest";

export const NativeSelect = Select.extend("MUI Native Select").filters({
  valid: (element) => !element.labels?.[0].classList.contains("Mui-error"),
  required: (element) => element.required,
});
export const NativeMultiSelect = MultiSelect.extend("MUI Native MultiSelect").filters({
  valid: (element) => !element.labels?.[0].classList.contains("Mui-error"),
  required: (element) => element.required,
});
