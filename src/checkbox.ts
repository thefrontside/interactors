import { CheckBox } from "@bigtest/interactor";

export const MaterialCheckbox = CheckBox.extend("MUI Checkbox")
  .filters({
    /**
     * Checkbox component does not set the native input element to indeterminate due to inconsistent behavior across browsers.
     * However, it set a data-indeterminate attribute on the input.
     */
    indeterminate: (element) => element.dataset.indeterminate === "true",
  })
  .actions({
    click: ({ perform }) =>
      perform((element) => {
        element.focus();
        element.click();
      }),
  });
