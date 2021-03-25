import { CheckBox } from "@bigtest/interactor";

export const MaterialCheckbox = CheckBox.extend("MuiCheckbox").filters({
  /**
   * Checkbox component does not set the native input element to indeterminate due to inconsistent behavior across browsers.
   * However, it set a data-indeterminate attribute on the input.
   */
  indeterminate: (element) => element.dataset.indeterminate === "true",
});
