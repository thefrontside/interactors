import { createInteractor, HTML, Interactor } from "@interactors/html";
import { userEvent } from "@interactors/html/testing-library";
import { createFormFieldFilters } from "./form-field-filters";
import { isDefined, isHTMLElement, delay, dispatchMouseDown, getInputLabel, applyGetter, isDisabled } from "./helpers";

export const SelectOption = HTML.extend<HTMLLIElement>("MUI Option")
  .selector('li[role="option"]')
  .filters({
    selected: (element) => element.getAttribute("aria-selected") == "true",
    disabled: {
      apply: isDisabled,
      default: false,
    },
  })
  .actions({
    choose: ({ perform }) => perform((element) => userEvent.click(element)),
  });

const SelectOptionsList = createInteractor<HTMLElement>("MUI OptionsList")
  .selector("ul")
  .locator((element) => element.getAttribute("aria-labelledby") ?? "");

async function closeSelectOptionsList(labelId: string) {
  await SelectOptionsList(labelId).perform((element) => {
    let popover = element.parentElement?.parentElement;
    if (popover?.getAttribute("role") == "presentation" && popover.classList.toString().includes("MuiPopover-root")) {
      let popoverTrap = popover.firstElementChild;
      if (isHTMLElement(popoverTrap)) popoverTrap.click();
    }
  });
}

function getValueText(element: HTMLInputElement) {
  let select = element.previousElementSibling;
  return isHTMLElement(select) ? select.innerText : "";
}

function getChipLabels(element: HTMLInputElement) {
  return Array.from(
    element.previousElementSibling?.querySelectorAll('[class*="MuiChip-root"] > [class*="MuiChip-label"]') ?? []
  )
    .map((chip) => (isHTMLElement(chip) ? chip.innerText : null))
    .filter(isDefined);
}

async function clearSelection(labelId: string) {
  let selected: string[] = [];

  await SelectOptionsList(labelId).perform(
    (element) =>
      (selected = Array.from(element.querySelectorAll("li"))
        .filter((option) => option.getAttribute("aria-selected") == "true")
        .map((option) => option.innerText))
  );
  for (let option of selected) {
    await SelectOptionsList(labelId).find(SelectOption(option)).choose();
  }
}

async function openSelectOptionsList<T>(interactor: Interactor<HTMLInputElement, T>) {
  let labelId = "";
  await interactor.perform((element) => (labelId = getInputLabel(element)?.id ?? ""));
  await interactor.perform((element) => {
    let select = element.previousElementSibling;
    if (isHTMLElement(select)) dispatchMouseDown(select);
  });
  await delay(100);
  return labelId;
}

const BaseSelect = createInteractor<HTMLInputElement>("MUI BaseSelect")
  .selector('[class*="MuiSelect-root"] + input[class*="MuiSelect-nativeInput"]')
  .locator((element) => getInputLabel(element)?.innerText ?? "")
  .filters({
    ...createFormFieldFilters<HTMLInputElement>(),
    id: (element) => element.previousElementSibling?.id,
    className: (element) => element.parentElement?.className ?? "",
    classList: (element) => Array.from(element.parentElement?.classList ?? []),
    valid: (element) => !element.previousElementSibling?.classList.toString().includes("Mui-error"),
    disabled: {
      apply: (element) => isDisabled(element.previousElementSibling),
      default: false,
    },
  })
  .actions({
    open: ({ perform }) =>
      perform((element) => {
        let selectElement = element.previousElementSibling;
        if (isHTMLElement(selectElement)) dispatchMouseDown(selectElement);
      }),
  });

const SelectInteractor = BaseSelect.extend("MUI Select")
  .filters({ value: getValueText })
  .actions({
    choose: async (interactor, value: string) => {
      if ((await applyGetter(interactor, getValueText)) == value) return;

      let labelId = await openSelectOptionsList(interactor);
      await SelectOptionsList(labelId).find(SelectOption(value)).choose();
    },
  });

const MultiSelectInteractor = BaseSelect.extend("MUI MultiSelect")
  .filters({ values: getChipLabels })
  .actions({
    choose: async (interactor, value: string) => {
      let selected = await applyGetter(interactor, getChipLabels);

      if (selected.length == 1 && selected[0] == value) return;

      let labelId = await openSelectOptionsList(interactor);
      await clearSelection(labelId);
      await SelectOptionsList(labelId).find(SelectOption(value)).choose();
      await closeSelectOptionsList(labelId);
    },
    select: async (interactor, value: string) => {
      let selected = await applyGetter(interactor, getChipLabels);

      if (selected.includes(value)) return;

      let labelId = await openSelectOptionsList(interactor);
      await SelectOptionsList(labelId).find(SelectOption(value)).choose();
      await closeSelectOptionsList(labelId);
    },
    deselect: async (interactor, value: string) => {
      let selected = await applyGetter(interactor, getChipLabels);

      if (!selected.includes(value)) return;

      let labelId = await openSelectOptionsList(interactor);
      await SelectOptionsList(labelId).find(SelectOption(value)).choose();
      await closeSelectOptionsList(labelId);
    },
  });

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
 * - `id`: *string* – Filter by id
 * - `valid`: *boolean* – Filter by whether the select is valid.
 * - `required`: *boolean* – Filter by whether the select is required.
 * - `description`: *string* – Filter by description.
 * - `value`: *string* – Filter by the text of the selected option.
 * - `disabled`: *boolean* – Filter by whether the select is disabled. Defaults to `false`.
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
export const Select = SelectInteractor;

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
 * - `id`: *string* – Filter by id
 * - `valid`: *boolean* – Filter by whether the select is valid.
 * - `required`: *boolean* – Filter by whether the select is required.
 * - `description`: *string* – Filter by description.
 * - `value`: *string* – Filter by the text of the selected option.
 * - `disabled`: *boolean* – Filter by whether the select is disabled. Defaults to `false`.
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
export const MultiSelect = MultiSelectInteractor;
