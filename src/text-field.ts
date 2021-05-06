import { TextField as BaseTextField } from "@bigtest/interactor";
import { createFormFieldFilters } from "./form-field-filters";
import { GetElementType } from "./types";

export const TextField = BaseTextField.extend("MUI TextField")
  .selector(["input", "textarea"].map((tag) => `${tag}.MuiInputBase-input`).join(", "))
  .filters(createFormFieldFilters<GetElementType<typeof BaseTextField>>());
