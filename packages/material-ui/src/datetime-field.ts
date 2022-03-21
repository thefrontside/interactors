import { TextField } from "@interactors/html";
import { dispatchChange, setValue } from "./helpers";

const DateTimeFieldInteractor = TextField.extend<HTMLInputElement>("DateTimeField")
  .selector('input[type="datetime-local"]')
  .filters({ timestamp: (element) => element.valueAsNumber })
  .actions({
    fillIn: async ({ perform }, value: string | Date) =>
      perform((element) => {
        setValue(element, typeof value == "string" ? value : value.toISOString().replace(/Z$/, ""));
        dispatchChange(element);
      }),
  });

/**
 * Call this {@link InteractorConstructor} to initialize a date-time field {@link
 * Interactor}. The date-time field interactor can be used to interact with date
 * fields on the page and to assert on their state. A date-time field is the date-time type input
 * tag with a text-like interface.
 *
 * The date-time field is located by the text of its label.
 *
 * ### Example
 *
 * ``` typescript
 * await DateTimeField('Appointment').fillIn('2012-06-13T09:13');
 * await DateTimeField('Appointment').has({ value: '2014-08-18T09:13' });
 * await DateTimeField({ id: 'appointment', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `value`: *string* – Filter by the date-time field's current value in ISO format.
 * - `timestamp`: *number* – Filter by the date-time field's current value as timestamp.
 * - `placeholder`: *string* – Filter by the date-time field's placeholder attribute.
 * - `valid`: *boolean* – Filter by whether the date-time field is valid.
 * - `disabled`: *boolean* – Filter by whether the date-time field is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the date-time field is focused. See {@link focused}.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the date-time field
 * - `focus()`: *{@link Interaction}* – Move focus to the date-time field
 * - `blur()`: *{@link Interaction}* – Move focus away from the date-time field
 * - `fillIn(value: string)`: *{@link Interaction}* – Fill in the date-time field with the given value. See {@link fillIn}.
 *
 * @category Interactor
 */
export const DateTimeField = DateTimeFieldInteractor;
