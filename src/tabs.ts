import { HTML } from "@bigtest/interactor";
import { isHTMLElement } from "./helpers";

export const Tab = HTML.extend<HTMLElement>("MUI Tab")
  .selector('[class*="MuiTab-root"][role="tab"]')
  .locator((element) => element.getAttribute("aria-label") ?? element.innerText)
  .filters({
    active: (element) => element.getAttribute("aria-selected") == "true",
    disabled: {
      apply: (element) =>
        element.getAttribute("aria-disabled") == "true" || (isHTMLElement(element, "Button") && element.disabled),
      default: false,
    },
  });

export const Tabs = HTML.extend<HTMLElement>("MUI Tabs")
  .selector('[class*="MuiTabs-root"]')
  .locator(
    (element) =>
      element.querySelector('[class*="MuiTabs-flexContainer"][role="tablist"]')?.getAttribute("aria-label") ?? ""
  )
  .filters({
    value: (element) => {
      const active = element.querySelector('[class*="MuiTab-root"][role="tab"][aria-selected="true"]');
      return isHTMLElement(active) ? active.getAttribute("aria-label") ?? active.innerText : "";
    },
  })
  .actions({ click: (interactor, value: string) => interactor.find(Tab(value)).click() });
