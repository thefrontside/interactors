import { createInteractor, HTML, isVisible, or } from "bigtest";
import { isHTMLElement } from "../test/helpers";

const getSummary = (element: HTMLElement) => element.querySelector(".MuiAccordionSummary-root");

export const AccordionSummary = HTML.extend<HTMLElement>("MUI Accordion Summary")
  .selector(".MuiAccordionSummary-root")
  .locator((element) => element.getAttribute("aria-label") ?? element.innerText)
  .filters({
    expanded: (element) => element.getAttribute("aria-expanded") == "true",
    disabled: {
      apply: (element) => element.getAttribute("aria-disabled") == "true",
      default: false,
    },
  });

export const AccordionDetails = createInteractor<HTMLElement>("MUI Accordion Details")
  .selector(".MuiAccordionDetails-root")
  .filters({
    id: (element) => element.id,
    visible: { apply: isVisible, default: true },
    className: (element) => element.className,
    classList: (element) => Array.from(element.classList),
  });

export const AccordionActions = createInteractor<HTMLElement>("MUI Accordion Actions")
  .selector(".MuiAccordionActions-root")
  .filters({
    id: (element) => element.id,
    visible: { apply: isVisible, default: true },
    className: (element) => element.className,
    classList: (element) => Array.from(element.classList),
  });

export const Accordion = createInteractor<HTMLElement>("MUI Accordion")
  .selector(".MuiAccordion-root")
  .locator((element) => {
    const summary = getSummary(element);
    return isHTMLElement(summary) ? summary.getAttribute("aria-label") ?? summary.innerText : "";
  })
  .filters({
    id: (element) => element.id,
    className: (element) => element.className,
    classList: (element) => Array.from(element.classList),
    expanded: (element) => getSummary(element)?.getAttribute("aria-expanded") == "true",
    disabled: {
      apply: (element) => getSummary(element)?.getAttribute("aria-disabled") == "true",
      default: false,
    },
  })
  .actions({
    expand: async (interactor) => {
      try {
        await interactor.is({ expanded: true, disabled: or(true, false) });
      } catch (_) {
        await interactor.find(AccordionSummary()).click();
      }
    },
    collapse: async (interactor) => {
      try {
        await interactor.is({ expanded: false, disabled: or(true, false) });
      } catch (_) {
        await interactor.find(AccordionSummary()).click();
      }
    },
    toggle: (interactor) => interactor.find(AccordionSummary()).click(),
  });
