import { innerText } from "@interactors/html";
import { getInputLabel, isHTMLElement } from "./helpers";

export const createFormFieldFilters = <E extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(): {
  valid: (element: E) => boolean;
  required: (element: E) => boolean;
  description: (element: E) => string;
} => ({
  valid: (element: E) => !element.labels?.[0].classList.toString().includes("Mui-error"),
  required: (element: E) => element.required,
  description: (element: E) => {
    let descriptionId = element.getAttribute("aria-describedby");
    let descriptionElement = descriptionId
      ? element.ownerDocument.getElementById(descriptionId)
      : getInputLabel(element)?.parentElement?.lastElementChild;
    return isHTMLElement(descriptionElement) ? innerText(descriptionElement) : "";
  },
});
