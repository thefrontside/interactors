import { TextField } from "@interactors/html";
import { dispatchChange, setValue } from "./helpers";

const TimeFieldInteractor = TextField.extend<HTMLInputElement>("TimeField")
  .selector('input[type="time"]')
  .filters({
    date: (element) => element.valueAsDate,
    timestamp: (element) => element.valueAsNumber,
  })
  .actions({
    fillIn: ({ perform }, value: string | Date) =>
      perform((element) => {
        setValue(element, typeof value == "string" ? value : value.toISOString().replace(/^.*T(.*)Z$/, "$1"));
        dispatchChange(element);
      }),
  });

/**
 * Call this {@link InteractorConstructor} to initialize a time field {@link
 * Interactor}. The time field interactor can be used to interact with date
 * fields on the page and to assert on their state. A time field is the time type input
 * tag with a text-like interface.
 *
 * The time field is located by the text of its label.
 *
 * ### Example
 *
 * ``` typescript
 * await DateTimeField('Alarm').fillIn('09:13');
 * await DateTimeField('Alarm').has({ value: '09:13' });
 * await DateTimeField({ id: 'alarm', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `value`: *string* – Filter by the time field's current value in ISO format.
 * - `date`: *Date | null* – Filter by the time field's current value as date.
 * - `timestamp`: *number* – Filter by the time field's current value as timestamp.
 * - `placeholder`: *string* – Filter by the time field's placeholder attribute.
 * - `valid`: *boolean* – Filter by whether the time field is valid.
 * - `disabled`: *boolean* – Filter by whether the time field is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the time field is focused. See {@link focused}.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the time field
 * - `focus()`: *{@link Interaction}* – Move focus to the time field
 * - `blur()`: *{@link Interaction}* – Move focus away from the time field
 * - `fillIn(value: string)`: *{@link Interaction}* – Fill in the time field with the given value. See {@link fillIn}.
 *
 * @category Interactor
 */
export const TimeField = TimeFieldInteractor;
