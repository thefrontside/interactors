import { HTML } from "@interactors/html";
import { isHTMLElement } from "./helpers";

export const Popover = HTML.extend("MUI Popover")
  .selector('[class*="MuiPopover-root"][role="presentation"]')
  .actions({
    close: ({ perform }) =>
      perform((element) => {
        let trapElement = element.firstElementChild;
        if (isHTMLElement(trapElement)) trapElement.click();
      }),
  });
