import { HTML } from "@bigtest/interactor";
import { applyGetter, isHTMLElement } from "./helpers";

const getSummary = (element: HTMLElement) => element.querySelector(".MuiAccordionSummary-root");
const isExpanded = (element: HTMLElement) => getSummary(element)?.getAttribute("aria-expanded") == "true";

const AccordionSummary = HTML.extend<HTMLElement>("MUI Accordion Summary")
  .selector(".MuiAccordionSummary-root")
  .locator((element) => element.getAttribute("aria-label") ?? element.innerText)
  .filters({
    expanded: (element) => element.getAttribute("aria-expanded") == "true",
    disabled: {
      apply: (element) => element.getAttribute("aria-disabled") == "true",
      default: false,
    },
  });

export const Accordion = HTML.extend<HTMLElement>("MUI Accordion")
  .selector(".MuiAccordion-root")
  .locator((element) => {
    const summary = getSummary(element);
    return isHTMLElement(summary) ? summary.getAttribute("aria-label") ?? summary.innerText : "";
  })
  .filters({
    expanded: isExpanded,
    disabled: {
      apply: (element) => getSummary(element)?.getAttribute("aria-disabled") == "true",
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
