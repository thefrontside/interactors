import { Select, MultiSelect } from "@interactors/html";
import { createFormFieldFilters } from "./form-field-filters";
import { GetElementType } from "./types";

const NativeSelectInteractor = Select.extend("MUINativeSelect").filters(
  createFormFieldFilters<GetElementType<typeof Select>>()
);
const NativeMultiSelectInteractor = MultiSelect.extend("MUINativeMultiSelect").filters(
  createFormFieldFilters<GetElementType<typeof Select>>()
);

/**
 * Call this {@link InteractorConstructor} to initialize a select {@link Interactor}.
 * The select interactor can be used to interact with selects and to assert on their state.
 *
 * For interacting with multiple selects, see {@link MultiSelect}.
 *
 * The select is located by the text of its label.
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
 * - `valid`: *boolean* – Filter by whether the select is valid.
 * - `required`: *boolean* – Filter by whether the select is required.
 * - `description`: *string* – Filter by description.
 * - `value`: *string* – Filter by the text of the selected option.
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `disabled`: *boolean* – Filter by whether the select is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the select is focused. See {@link focused}.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the select
 * - `focus()`: *{@link Interaction}* – Move focus to the select
 * - `blur()`: *{@link Interaction}* – Move focus away from the select
 * - `choose(text: string)`: *{@link Interaction}* – Choose the option with the given text from the select.
 *
 * @category Interactor
 */
export const NativeSelect = NativeSelectInteractor;

/**
 * Call this {@link InteractorConstructor} to initialize a select {@link Interactor}.
 * The select interactor can be used to interact with selects with the `multiple` attribute
 * and to assert on their state.
 *
 * See {@link Select} for an interactor for single select.
 *
 * The multi select is located by the text of its label.
 *
 * ### Example
 *
 * ``` typescript
 * await MultiSelect('Language').select('English');
 * await MultiSelect('Language').select('German');
 * await MultiSelect('Language').deselect('Swedish');
 * await MultiSelect('Language').has({ values: ['English', 'German'] });
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `valid`: *boolean* – Filter by whether the select is valid.
 * - `required`: *boolean* – Filter by whether the select is required.
 * - `description`: *string* – Filter by description.
 * - `value`: *string* – Filter by the text of the selected option.
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `disabled`: *boolean* – Filter by whether the select is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the select is focused. See {@link focused}.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the multi select
 * - `focus()`: *{@link Interaction}* – Move focus to the multi select
 * - `blur()`: *{@link Interaction}* – Move focus away from the multi select
 * - `choose(text: string)`: *{@link Interaction}* – Choose the option with the given text from the multi select. Will deselect all other selected options.
 * - `select(text: string)`: *{@link Interaction}* – Add the option with the given text to the selection.
 * - `deselect(text: string)`: *{@link Interaction}* – Remove the option with the given text from the selection.
 *
 * @category Interactor
 */
export const NativeMultiSelect = NativeMultiSelectInteractor;
