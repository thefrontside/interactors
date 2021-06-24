import { RadioButton, isVisible } from "@bigtest/interactor";
import { isHTMLElement } from "./helpers";

export default RadioButton.extend("radio")
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
