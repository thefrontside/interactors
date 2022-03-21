import { TextField } from "@interactors/html";
import { dispatchChange, setValue } from "./helpers";

const DateFieldInteractor = TextField.extend<HTMLInputElement>("DateField")
  .selector('input[type="date"]')
  .filters({
    date: (element) => element.valueAsDate,
    timestamp: (element) => element.valueAsNumber,
  })
  .actions({
    fillIn: async ({ perform }, value: string | Date) =>
      perform((element) => {
        setValue(element, typeof value == "string" ? value : value.toISOString().replace(/T.*$/, ""));
        dispatchChange(element);
      }),
  });

/**
 * Call this {@link InteractorConstructor} to initialize a date field {@link
 * Interactor}. The date field interactor can be used to interact with date
 * fields on the page and to assert on their state. A date field is the date type input
 * tag with a text-like interface.
 *
 * The date field is located by the text of its label.
 *
 * ### Example
 *
 * ``` typescript
 * await DateField('Date of birth').fillIn('2012-06-13');
 * await DateField('Date of birth').has({ value: '2014-08-18' });
 * await DateField({ id: 'birth-date', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `value`: *string* – Filter by the date field's current value in ISO format.
 * - `date`: *Date | null* – Filter by the date field's current value as date.
 * - `timestamp`: *number* – Filter by the date field's current value as timestamp.
 * - `placeholder`: *string* – Filter by the date field's placeholder attribute.
 * - `valid`: *boolean* – Filter by whether the date field is valid.
 * - `disabled`: *boolean* – Filter by whether the date field is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the date field is focused. See {@link focused}.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the date field
 * - `focus()`: *{@link Interaction}* – Move focus to the date field
 * - `blur()`: *{@link Interaction}* – Move focus away from the date field
 * - `fillIn(value: string)`: *{@link Interaction}* – Fill in the date field with the given value. See {@link fillIn}.
 *
 * @category Interactor
 */
export const DateField = DateFieldInteractor;
