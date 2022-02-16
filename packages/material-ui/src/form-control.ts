import { HTML, innerText } from "@interactors/html";
import { isHTMLElement } from "./helpers";

function getLabelElement(root: HTMLElement) {
  let label = root.querySelector('label[class*="MuiFormLabel-root"]');
  return isHTMLElement(label) ? label : null;
}

const FormControlInteractor = HTML.extend("MUIFormControl")
  .selector('[class*="MuiFormControl-root"]')
  .locator((element) => innerText(getLabelElement(element)))
  .filters({
    valid: (element) => !getLabelElement(element)?.classList.toString().includes("Mui-error"),
    description: (element) => {
      let descriptionElement = element?.lastElementChild;
      return isHTMLElement(descriptionElement) ? innerText(descriptionElement) : "";
    },
  });

/**
 * Call this {@link InteractorConstructor} to initialize a form control {@link
 * Interactor}. The form control interactor can be used to assert on form
 * fields state.
 *
 * The form control is located by the text of its label.
 *
 * ### Example
 *
 * ``` typescript
 * await FormControl('Email').has({ description: 'Email for newsletters' });
 * await FormControl({ id: 'email-field', valid: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `valid`: *boolean* – Filter by whether the form field is valid.
 * - `description`: *string* – Filter by the form's field description text.
 * - `disabled`: *boolean* – Filter by whether the form field is disabled. Defaults to `false`.
 *
 * @category Interactor
 */
export const FormControl = FormControlInteractor;
