import { dispatchChange, dispatchInput } from './dispatch.ts';
import { getSelect } from './get-select.ts';
import { HTML } from './html.ts';
import { FormField } from './form-field.ts';

const SelectOption = HTML.extend<HTMLOptionElement>('SelectOption')
  .selector('option')
  .locator((element) => element.label)
  .filters({
    disabled: {
      apply: (element) => element.disabled,
      default: false
    }
  })
  .actions({
    choose: ({ perform }) => perform((element) => {
      let select = getSelect(element);

      if(select.value !== element.value) {
        select.value = element.value;
        dispatchChange(select);
        dispatchInput(select);
      }
    }),
  })

const SelectInteractor = FormField.extend<HTMLSelectElement>('Select')
  .selector('select:not([multiple])')
  .filters({
    value: (element) => element.selectedOptions[0]?.label || '',
  })
  .actions({
    choose: async (interactor, value: string) => {
      await interactor.find(SelectOption(value)).choose();
    },
  })

/**
 * Call this {@link InteractorConstructor} to initialize an {@link Interactor}
 * for select boxes. The select interactor can be used to interact with select
 * boxes and to assert on their state.
 *
 * For interacting with multiple select boxes, see {@link MultiSelect}.
 *
 * The select box is located by the text of its label.
 *
 * ### Example
 *
 * ``` typescript
 * await Select('Language').select('English');
 * await Select('Language').has({ value: 'English' });
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `valid`: *boolean* – Filter by whether the select box is valid.
 * - `value`: *string* – Filter by the text of the selected option.
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `disabled`: *boolean* – Filter by whether the select box is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the select box is focused. See {@link focused}.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the select box
 * - `focus()`: *{@link Interaction}* – Move focus to the select box
 * - `blur()`: *{@link Interaction}* – Move focus away from the select box
 * - `choose(text: string)`: *{@link Interaction}* – Choose the option with the given text from the select box.
 *
 * @category Interactor
 */
export const Select = SelectInteractor;
