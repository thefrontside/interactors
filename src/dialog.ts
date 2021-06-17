import { HTML } from "@bigtest/interactor";
import { isHTMLElement } from "./helpers";

export const Dialog = HTML.extend("MUI Dialog")
  .selector('[class*="MuiDialog-root"][role="presentation"]:not([aria-hidden="true"])')
  .locator((element) => {
    const labelId = element.querySelector('[class*="MuiDialog-paper"][role="dialog"]')?.getAttribute("aria-labelledby");
    const titleElement = labelId
      ? element.querySelector(`#${labelId}`)
      : element.querySelector('[class*="MuiDialogTitle-root"]');
    return isHTMLElement(titleElement) ? titleElement.innerText : "";
  })
  .actions({
    close: ({ perform }) =>
      perform((element) => {
        const backdrop = element.querySelector('[class*="MuiBackdrop-root"]');
        if (isHTMLElement(backdrop)) backdrop.click();
      }),
  });
