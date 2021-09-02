import { HTML } from "@interactors/html";
import { applyGetter, isDisabled, isHTMLElement } from "./helpers";

const getSummary = (element: HTMLElement) => element.querySelector('[class*="MuiAccordionSummary-root"]');
const isExpanded = (element: HTMLElement) => getSummary(element)?.getAttribute("aria-expanded") == "true";

const AccordionSummary = HTML.extend<HTMLElement>("MUI Accordion Summary")
  .selector('[class*="MuiAccordionSummary-root"]')
  .locator((element) => element.getAttribute("aria-label") ?? element.innerText)
  .filters({
    expanded: (element) => element.getAttribute("aria-expanded") == "true",
    disabled: {
      apply: isDisabled,
      default: false,
    },
  });

export const Accordion = HTML.extend<HTMLElement>("MUI Accordion")
  .selector('[class*="MuiAccordion-root"]')
  .locator((element) => {
    let summary = getSummary(element);
    return isHTMLElement(summary) ? summary.getAttribute("aria-label") ?? summary.innerText : "";
  })
  .filters({
    expanded: isExpanded,
    disabled: {
      apply: (element) => isDisabled(getSummary(element)),
      default: false,
    },
  })
  .actions({
    expand: async (interactor) => {
      if (await applyGetter(interactor, isExpanded)) return;

      await interactor.find(AccordionSummary()).click();
    },
    collapse: async (interactor) => {
      if (!(await applyGetter(interactor, isExpanded))) return;

      await interactor.find(AccordionSummary()).click();
    },
    toggle: (interactor) => interactor.find(AccordionSummary()).click(),
  });
