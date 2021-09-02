import { HTML } from "@interactors/html";
import { isHTMLElement } from "./helpers";

function getLabelElement(root: HTMLElement) {
  let label = root.querySelector('label[class*="MuiFormLabel-root"]');
  return isHTMLElement(label) ? label : null;
}

export const FormControl = HTML.extend("MUI Form Control")
  .selector('[class*="MuiFormControl-root"]')
  .locator((element) => getLabelElement(element)?.innerText ?? "")
  .filters({
    valid: (element) => !getLabelElement(element)?.classList.toString().includes("Mui-error"),
    description: (element) => {
      let descriptionElement = element?.lastElementChild;
      return isHTMLElement(descriptionElement) ? descriptionElement.innerText : "";
    },
  });
