import { innerText, TextField as BaseTextField } from "@interactors/html";
import { createFormFieldFilters } from "./form-field-filters";
import { isHTMLElement } from "./helpers";
import { GetElementType } from "./types";

const TextFieldInteractor = BaseTextField.extend("MUITextField")
  .selector(["input", "textarea"].map((tag) => `${tag}[class*="MuiInputBase-input"]`).join(", "))
  .locator((element) => {
    let label = element.labels?.[0] ?? element.parentElement?.previousElementSibling;
    return isHTMLElement(label, "Label") ? innerText(label) : element.placeholder;
  })
  .filters(createFormFieldFilters<GetElementType<typeof BaseTextField>>());

/**
 * Call this {@link InteractorConstructor} to initialize a text field {@link
 * Interactor}. The text field interactor can be used to interact with text
 * fields on the page and to assert on their state. A text field is any input
 * tag with a text-like interface, so input fields with e.g. `email` or `number`
 * types are also considered text fields, as is any input field with an unknown
 * type.
 *
 * The text field is located by the text of its label or placeholder.
 *
 * ### Example
 *
 * ``` typescript
 * await TextField('Email').fillIn('jonas@example.com');
 * await TextField('Email').has({ value: 'jonas@example.com' });
 * await TextField({ id: 'email-field', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `value`: *string* – Filter by the text field's current value.
 * - `placeholder`: *string* – Filter by the text field's placeholder attribute.
 * - `description`: *string* – Filter by the text field's description attribute.
 * - `valid`: *boolean* – Filter by whether the text field is valid.
 * - `required`: *boolean* – Filter by whether the text field is required.
 * - `disabled`: *boolean* – Filter by whether the text field is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the text field is focused. See {@link focused}.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the text field
 * - `focus()`: *{@link Interaction}* – Move focus to the text field
 * - `blur()`: *{@link Interaction}* – Move focus away from the text field
 * - `fillIn(value: string)`: *{@link Interaction}* – Fill in the text field with the given value. See {@link fillIn}.
 *
 * @category Interactor
 */
export const TextField = TextFieldInteractor;
