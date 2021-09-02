import { CheckBox as BaseCheckbox, isVisible } from "@interactors/html";

export const Checkbox = BaseCheckbox.extend("MUI Checkbox")
  .selector('[class*="MuiCheckbox-root"] input[type=checkbox]')
  .locator(
    (element) => (BaseCheckbox().options.specification.locator?.(element) || element.getAttribute("aria-label")) ?? ""
  )
  .filters({
    /**
     * Checkbox component does not set the native input element to indeterminate due to inconsistent behavior across browsers.
     * However, it set a data-indeterminate attribute on the input.
     */
    indeterminate: (element) => element.dataset.indeterminate === "true",
    visible: {
      apply: (element) =>
        isVisible(element) ||
        (element.labels && Array.from(element.labels).some(isVisible)) ||
        (element.parentElement && isVisible(element.parentElement)),
      default: true,
    },
  })
  .actions({
    click: ({ perform }) =>
      perform((element) => {
        element.focus();
        element.click();
      }),
  });
