import { RadioButton, isVisible } from "@bigtest/interactor";

export default RadioButton.extend("radio")
  .selector('[class*="MuiRadio-root"] input[type=radio]')
  .filters({
    visible: {
      apply: (el) => isVisible(el.closest('[class*="MuiRadio-root"]')!),
      default: true,
    },
  });
