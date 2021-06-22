import { HTML } from "@bigtest/interactor";
import { isHTMLElement } from "./helpers";

export const Popover = HTML.extend("MUI Popover")
  .selector('[class*="MuiPopover-root"][role="presentation"]')
  .actions({
    close: ({ perform }) =>
      perform((element) => {
        const trapElement = element.firstElementChild;
        if (isHTMLElement(trapElement)) trapElement.click();
      }),
  });
