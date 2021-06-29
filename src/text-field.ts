import { TextField as BaseTextField } from "@bigtest/interactor";
import { createFormFieldFilters } from "./form-field-filters";
import { isHTMLElement } from "./helpers";
import { GetElementType } from "./types";

export const TextField = BaseTextField.extend("MUI TextField")
  .selector(["input", "textarea"].map((tag) => `${tag}[class*="MuiInputBase-input"]`).join(", "))
  .locator((element) => {
    let label = element.labels?.[0] ?? element.parentElement?.previousElementSibling;
    return isHTMLElement(label, "Label") ? label.innerText : element.placeholder;
  })
  .filters(createFormFieldFilters<GetElementType<typeof BaseTextField>>());
