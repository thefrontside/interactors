import { HTML } from "bigtest";
import { isHTMLElement } from "./helpers";

export const FormControl = HTML.extend("MUI Form Control")
  .selector(".MuiFormControl-root")
  .locator((element) => {
    const label = element.querySelector("label.MuiFormLabel-root");
    return isHTMLElement(label) ? label.innerText : "";
  });
