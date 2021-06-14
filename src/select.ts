import { createInteractor, HTML, Interactor } from "@bigtest/interactor";
import { createFormFieldFilters } from "./form-field-filters";
import { isDefined, isHTMLElement, delay, dispatchMouseDown, getInputLabel, applyGetter } from "./helpers";

const Option = HTML.extend<HTMLLIElement>("MUI Option")
  .selector('li[role="option"]')
  .filters({
    selected: (element) => element.getAttribute("aria-selected") == "true",
    disabled: {
      apply: (element) => element.getAttribute("aria-disabled") == "true",
      default: false,
    },
  })
  .actions({
    choose: ({ perform }) => perform((element) => element.click()),
  });

const SelectOptionsList = createInteractor<HTMLElement>("MUI OptionsList")
  .selector("ul")
  .locator((element) => element.getAttribute("aria-labelledby") ?? "");

async function closeSelectOptionsList(labelId: string) {
  await SelectOptionsList(labelId).perform((element) => {
    const popover = element.parentElement?.parentElement;
    if (popover?.getAttribute("role") == "presentation" && popover.classList.contains("MuiPopover-root")) {
      const popoverTrap = popover.firstElementChild;
      if (isHTMLElement(popoverTrap)) popoverTrap.click();
    }
  });
}

function getValueText(element: HTMLInputElement) {
  const select = element.previousElementSibling;
  return isHTMLElement(select) ? select.innerText : "";
}

function getChipLabels(element: HTMLInputElement) {
  return Array.from(element.previousElementSibling?.querySelectorAll(".MuiChip-root > .MuiChip-label") ?? [])
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
  for (const option of selected) {
    await SelectOptionsList(labelId).find(Option(option)).choose();
  }
}

async function openSelectOptionsList(interactor: Interactor<HTMLInputElement, any>) {
  let labelId = "";
  await interactor.perform((element) => (labelId = getInputLabel(element)?.id ?? ""));
  await interactor.perform((element) => {
    const select = element.previousElementSibling;
    if (isHTMLElement(select)) dispatchMouseDown(select);
  });
  await delay(100);
  return labelId;
}

const BaseSelect = createInteractor<HTMLInputElement>("MUI BaseSelect")
  .selector(".MuiSelect-root + input.MuiSelect-nativeInput")
  .locator((element) => getInputLabel(element)?.innerText ?? "")
  .filters({
    ...createFormFieldFilters<HTMLInputElement>(),
    id: (element) => element.previousElementSibling?.id,
    className: (element) => element.parentElement?.className ?? "",
    classList: (element) => Array.from(element.parentElement?.classList ?? []),
    valid: (element) => !element.previousElementSibling?.classList.contains("Mui-error"),
    disabled: {
      apply: (element) => element.previousElementSibling?.getAttribute("aria-disabled") == "true",
      default: false,
    },
  });

export const Select = BaseSelect.extend("MUI Select")
  .filters({ value: getValueText })
  .actions({
    choose: async (interactor, value: string) => {
      if ((await applyGetter(interactor, getValueText)) == value) return;

      const labelId = await openSelectOptionsList(interactor);
      await SelectOptionsList(labelId).find(Option(value)).choose();
    },
  });

export const MultiSelect = BaseSelect.extend("MUI MultiSelect")
  .filters({ values: getChipLabels })
  .actions({
    choose: async (interactor, value: string) => {
      const selected = await applyGetter(interactor, getChipLabels);

      if (selected.length == 1 && selected[0] == value) return;

      const labelId = await openSelectOptionsList(interactor);
      await clearSelection(labelId);
      await SelectOptionsList(labelId).find(Option(value)).choose();
      await closeSelectOptionsList(labelId);
    },
    select: async (interactor, value: string) => {
      const selected = await applyGetter(interactor, getChipLabels);

      if (selected.includes(value)) return;

      const labelId = await openSelectOptionsList(interactor);
      await SelectOptionsList(labelId).find(Option(value)).choose();
      await closeSelectOptionsList(labelId);
    },
    deselect: async (interactor, value: string) => {
      const selected = await applyGetter(interactor, getChipLabels);

      if (!selected.includes(value)) return;

      const labelId = await openSelectOptionsList(interactor);
      await SelectOptionsList(labelId).find(Option(value)).choose();
      await closeSelectOptionsList(labelId);
    },
  });
