import { HTML } from "@bigtest/interactor";
import { isHTMLElement } from "./helpers";

function getLabelElement(root: HTMLElement) {
  const label = root.querySelector("label.MuiFormLabel-root");
  return isHTMLElement(label) ? label : null;
}

export const FormControl = HTML.extend("MUI Form Control")
  .selector(".MuiFormControl-root")
  .locator((element) => getLabelElement(element)?.innerText ?? "")
  .filters({
    valid: (element) => !getLabelElement(element)?.classList.contains("Mui-error"),
    description: (element) => {
      const descriptionElement = element?.lastElementChild;
      return isHTMLElement(descriptionElement) ? descriptionElement.innerText : "";
    },
  });
