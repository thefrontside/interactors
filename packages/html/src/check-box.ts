import { click, isVisible } from '@interactors/core';
import { FormField } from './form-field.ts';

const CheckBoxInteractor = FormField.extend<HTMLInputElement>('CheckBox')
  .selector('input[type=checkbox]')
  .filters({
    checked: (element) => element.checked,
    indeterminate: (element) => element.indeterminate,
    visible: {
      apply: (element) => isVisible(element) || (element.labels && Array.from(element.labels).some(isVisible)),
      default: true
    },
  })
  .actions({
    check: ({ perform }) => perform((element) => {
      if ((!element.checked || element.indeterminate)) click(element);
    }),
    uncheck: ({ perform }) => perform((element) => {
      if ((element.checked || element.indeterminate)) click(element);
    }),
    toggle: ({ perform }) => perform((element) => click(element)),
  })

/**
 * Call this {@link InteractorConstructor} to initialize a checkbox {@link Interactor}.
 * The checkbox interactor can be used to interact with checkboxes on the page and
 * to assert on their state.
 *
 * The checkbox is located by the text of its label.
 *
 * ### Example
 *
 * ``` typescript
 * await CheckBox('Accept').check();
 * await CheckBox('Accept').is({ disabled: true });
 * await CheckBox({ id: 'accept', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `valid`: *boolean* – Filter by whether the checkbox is valid.
 * - `checked`: *boolean* – Filter by whether the checkbox is checked.
 * - `indeterminate`: *boolean* - Filter by whether the checkbox has indeterminate state.
 * - `disabled`: *boolean* – Filter by whether the checkbox is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the checkbox is focused. See {@link focused}.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the checkbox
 * - `focus()`: *{@link Interaction}* – Focus the checkbox
 * - `blur()`: *{@link Interaction}* – Blur the checkbox
 * - `check()`: *{@link Interaction}* – Check the checkbox if it is not checked
 * - `uncheck()`: *{@link Interaction}* – Uncheck the checkbox if it is checked
 * - `toggle()`: *{@link Interaction}* – Toggle the checkbox
 *
 * @category Interactor
 */
export const CheckBox = CheckBoxInteractor;
