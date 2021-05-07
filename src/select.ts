import { createInteractor, HTML, Interactor } from "bigtest";
import { isDefined, isHTMLElement, innerText, delay, dispatchMouseDown } from "./helpers";

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

function getInputLabel(element: HTMLElement) {
  const input = element.nextElementSibling;
  return isHTMLElement(input, "Input") ? input.labels?.[0] : undefined;
}

function getSelectValues(element: HTMLElement) {
  return Array.from(element.querySelectorAll(".MuiChip-root > .MuiChip-label") ?? [])
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

async function openSelectOptionsList(interactor: Interactor<HTMLElement, any>) {
  let labelId = "";
  await interactor.perform((element) => (labelId = getInputLabel(element)?.id ?? ""));
  await interactor.perform((element) => dispatchMouseDown(element));
  await delay(100);
  return labelId;
}

const BaseSelect = createInteractor<HTMLElement>("MUI BaseSelect")
  .selector(".MuiSelect-root")
  .locator((element) => {
    const label = getInputLabel(element);
    return label ? innerText(label) : "";
  })
  .filters({
    id: (element) => element.id,
    className: (element) => Array.from(element.parentElement?.classList ?? []),
    valid: (element) => !element.parentElement?.classList.contains("Mui-error"),
    required: (element) => element.parentElement?.hasAttribute("required"),
    disabled: {
      apply: (element) => element.getAttribute("aria-disabled") == "true",
      default: false,
    },
  });

export const Select = BaseSelect.extend("MUI Select")
  .filters({
    value: (element) => element.innerText,
  })
  .actions({
    choose: async (interactor, value: string) => {
      let selected: null | string = null;

      await interactor.perform((element) => (selected = element.innerText));

      if (selected == value) return;

      const labelId = await openSelectOptionsList(interactor);
      await SelectOptionsList(labelId).find(Option(value)).choose();
    },
  });

export const MultiSelect = BaseSelect.extend("MUI MultiSelect")
  .filters({
    values: getSelectValues,
  })
  .actions({
    choose: async (interactor, value: string) => {
      let selected: string[] = [];

      await interactor.perform((element) => (selected = getSelectValues(element)));

      if (selected.length == 1 && selected[0] == value) return;

      const labelId = await openSelectOptionsList(interactor);
      await clearSelection(labelId);
      await SelectOptionsList(labelId).find(Option(value)).choose();
      await closeSelectOptionsList(labelId);
    },
    select: async (interactor, value: string) => {
      let selected: string[] = [];

      await interactor.perform((element) => (selected = getSelectValues(element)));

      if (selected.includes(value)) return;

      const labelId = await openSelectOptionsList(interactor);
      await SelectOptionsList(labelId).find(Option(value)).choose();
      await closeSelectOptionsList(labelId);
    },
    deselect: async (interactor, value: string) => {
      let selected: string[] = [];

      await interactor.perform((element) => (selected = getSelectValues(element)));

      if (!selected.includes(value)) return;

      const labelId = await openSelectOptionsList(interactor);
      await SelectOptionsList(labelId).find(Option(value)).choose();
      await closeSelectOptionsList(labelId);
    },
  });
