import { HTML } from './html';

type FieldTypes = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function isElement<T extends keyof HTMLElementTagNameMap>(element: Element, tagName: T): element is HTMLElementTagNameMap[T] {
  return element.tagName.toLowerCase() === tagName;
}

const LabelInteractor = HTML.extend<HTMLLabelElement>('Label')
  .selector((element) => {
    if(isElement(element, 'input') || isElement(element, 'select') || isElement(element, 'textarea')) {
      return Array.from(element.labels || []);
    } else {
      return [];
    }
  })

const FormFieldInteractor = HTML.extend<FieldTypes>('FormField')
  .locator(LabelInteractor().text())
  .filters({
    valid: (element) => element.validity.valid,
    disabled: {
      apply: (element) => element.disabled,
      default: false
    },
  })

/**
 * Use this {@link InteractorConstructor} as a base for creating interactors which
 * work with form fields. This allows you to use field labels as locators, and also provides
 * some basic filters which are convenient for most form fields.
 *
 * Locates the form field by its label.
 *
 * ### Example
 *
 * ``` typescript
 * const PasswordField = FormField.extend<HTMLInputElement>('password field')
 *   .selector('input[type=password'])
 *   .filters({
 *     value: (element) => element.value,
 *     placeholder: (element) => element.placeholder,
 *   })
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `focused`: *boolean* – Filter by whether the form field is focused. See {@link focused}.
 * - `valid`: *boolean* – Filter by whether the form field is valid.
 * - `disabled`: *boolean* – Filter by whether the form field is disabled. Defaults to `false`.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the form field
 * - `focus()`: *{@link Interaction}* – Move focus to the form field
 * - `blur()`: *{@link Interaction}* – Move focus away from the form field
 *
 * @category Interactor
 */
export const FormField = FormFieldInteractor;
