import { createInteractor, including, Interactor, not } from "bigtest";
import { isDefined, isHTMLElement, innerText, delay, dispatchMouseDown } from "./helpers";

const Option = createInteractor<HTMLLIElement>("MUI Option")
  .selector('li[role="option"]')
  .locator((element) => element.innerText)
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

async function closeOptionsList(labelId: string) {
  try {
    await SelectOptionsList(labelId).perform((element) => {
      const popover = element.parentElement?.parentElement;
      if (popover?.getAttribute("role") == "presentation" && popover.classList.contains("MuiPopover-root")) {
        const popoverTrap = popover.firstElementChild;
        if (isHTMLElement(popoverTrap)) popoverTrap.click();
      }
    });
  } catch (_) {
    /* noop */
  }
}

function getInputLabel(element: HTMLElement) {
  const input = element.nextElementSibling;
  return isHTMLElement(input, "Input") ? input.labels?.[0] : undefined;
}

async function toggleOption(
  interactor: Interactor<HTMLElement, any>,
  value: string,
  { clearSelection = false }: { clearSelection?: boolean } = {}
) {
  let labelId = "";
  let selected: string[] = [];
  await interactor.perform((element) => (labelId = getInputLabel(element)?.id ?? ""));
  await interactor.perform((element) => dispatchMouseDown(element));
  await delay(100);
  try {
    if (clearSelection) {
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
    await SelectOptionsList(labelId).find(Option(value)).choose();
  } finally {
    await closeOptionsList(labelId);
  }
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
      try {
        await interactor.has({ value });
      } catch (_) {
        await toggleOption(interactor, value, { clearSelection: true });
      }
    },
  });

export const MultiSelect = BaseSelect.extend("MUI MultiSelect")
  .filters({
    values: (element) =>
      Array.from(element.querySelectorAll(".MuiChip-root > .MuiChip-label") ?? [])
        .map((chip) => (isHTMLElement(chip) ? chip.innerText : null))
        .filter(isDefined),
  })
  .actions({
    choose: async (interactor, value: string) => {
      try {
        await interactor.has({ values: [value] });
      } catch (_) {
        await toggleOption(interactor, value, { clearSelection: true });
      }
    },
    select: async (interactor, value: string) => {
      try {
        await interactor.has({ values: including(value) });
      } catch (_) {
        await toggleOption(interactor, value);
      }
    },
    deselect: async (interactor, value: string) => {
      try {
        await interactor.has({ values: not(including(value)) });
      } catch (_) {
        await toggleOption(interactor, value);
      }
    },
  });
