import { TextField as BaseTextField } from "@bigtest/interactor";
import { createFormFieldFilters } from "./form-field-filters";
import { isHTMLElement } from "./helpers";
import { GetElementType } from "./types";

export const TextField = BaseTextField.extend("MUI TextField")
  .selector(["input", "textarea"].map((tag) => `${tag}.MuiInputBase-input`).join(", "))
  .locator((element) => {
    const label = element.labels?.[0] ?? element.parentElement?.parentElement?.firstElementChild;
    return isHTMLElement(label) ? label.innerText : element.placeholder;
  })
  .filters(createFormFieldFilters<GetElementType<typeof BaseTextField>>());
