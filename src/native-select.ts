import { Filters } from "@bigtest/interactor/dist/specification";
import { Select, MultiSelect } from "bigtest";

// TODO Custom input select
// TODO Multiple Select
// TODO Custom menu
// TODO Groups in menu
// TODO Native Select

export const NativeSelect = Select.extend("MUI Native Select").filters({
  valid: (element) => !element.labels?.[0].classList.contains("Mui-error"),
  required: (element) => element.required,
});
export const NativeMultiSelect = MultiSelect.extend("MUI Native MultiSelect").filters({
  valid: (element) => !element.labels?.[0].classList.contains("Mui-error"),
  required: (element) => element.required,
});
