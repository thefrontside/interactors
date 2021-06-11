import { Button, HTML } from "@bigtest/interactor";
import { isHTMLElement } from "./helpers";

export const Tab = HTML.extend<HTMLElement>("MUI Tab")
  .selector('.MuiTab-root[role="tab"]')
  .locator((element) => (element.innerText || element.getAttribute("aria-label")) ?? "")
  .filters({
    active: (element) => element.getAttribute("aria-selected") == "true",
    disabled: {
      apply: (element) =>
        element.getAttribute("aria-disabled") == "true" || (isHTMLElement(element, "Button") && element.disabled),
      default: false,
    },
  });

export const Tabs = HTML.extend<HTMLElement>("MUI Tabs")
  .selector(".MuiTabs-root")
  .locator(
    (element) => element.querySelector('.MuiTabs-flexContainer[role="tablist"]')?.getAttribute("aria-label") ?? ""
  )
  .filters({
    value: (element) => {
      const active = element.querySelector('.MuiTab-root[role="tab"][aria-selected="true"]');
      return isHTMLElement(active) ? (active.innerText || active.getAttribute("aria-label")) ?? "" : "";
    },
  })
  .actions({ click: (interactor, value: string) => interactor.find(Tab(value)).click() });
