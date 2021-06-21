import { HTML } from "@bigtest/interactor";

export const Popover = HTML.extend("MUI Popover")
  .selector('[class*="MuiPopover-root"][role="presentation"]')
  .locator((element) => element.id);
