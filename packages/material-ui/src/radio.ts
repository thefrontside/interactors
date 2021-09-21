import { RadioButton, isVisible } from "@interactors/html";
import { isHTMLElement } from "./helpers";

export const Radio = RadioButton.extend("radio")
  .selector('[class*="MuiRadio-root"] input[type=radio]')
  .filters({
    visible: {
      apply: (element) => {
        let closest = element.closest('[class*="MuiRadio-root"]');
        return isHTMLElement(closest) ? isVisible(closest) : false;
      },
      default: true,
    },
  });
