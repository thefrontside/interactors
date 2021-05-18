import { Select, MultiSelect } from "@bigtest/interactor";
import { createFormFieldFilters } from "./form-field-filters";
import { GetElementType } from "./types";

export const NativeSelect = Select.extend("MUI Native Select").filters(
  createFormFieldFilters<GetElementType<typeof Select>>()
);
export const NativeMultiSelect = MultiSelect.extend("MUI Native MultiSelect").filters(
  createFormFieldFilters<GetElementType<typeof Select>>()
);
