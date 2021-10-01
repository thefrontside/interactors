import { HTML } from "@interactors/html";
import { userEvent } from "@interactors/html/testing-library";
import { isHTMLElement } from "./helpers";

export const Dialog = HTML.extend("MUI Dialog")
  .selector('[class*="MuiDialog-root"][role="presentation"]:not([aria-hidden="true"])')
  .locator((element) => {
    let labelId = element.querySelector('[class*="MuiDialog-paper"][role="dialog"]')?.getAttribute("aria-labelledby");
    let titleElement = labelId
      ? element.querySelector(`#${labelId}`)
      : element.querySelector('[class*="MuiDialogTitle-root"]');
    return isHTMLElement(titleElement) ? titleElement.innerText : "";
  })
  .actions({
    close: ({ perform }) =>
      perform((element) => {
        let backdrop = element.querySelector('[class*="MuiBackdrop-root"]');
        if (isHTMLElement(backdrop)) userEvent.click(backdrop);
      }),
  });
