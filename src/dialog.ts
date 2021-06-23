import { HTML } from "@bigtest/interactor";
import { isHTMLElement } from "./helpers";

export const Dialog = HTML.extend("MUI Dialog")
  .selector('.MuiDialog-root[role="presentation"]:not([aria-hidden="true"])')
  .locator((element) => {
    let labelId = element.querySelector('.MuiDialog-paper[role="dialog"]')?.getAttribute("aria-labelledby");
    let titleElement = labelId ? element.querySelector(`#${labelId}`) : element.querySelector(".MuiDialogTitle-root");
    return isHTMLElement(titleElement) ? titleElement.innerText : "";
  })
  .actions({
    close: ({ perform }) =>
      perform((element) => {
        let backdrop = element.querySelector(".MuiBackdrop-root");
        if (isHTMLElement(backdrop)) backdrop.click();
      }),
  });
