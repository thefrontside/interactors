import { createInteractor, HTML } from "bigtest";
import { isHTMLElement } from "../test/helpers";

export const Tab = HTML.extend<HTMLButtonElement>("MUI Tab")
  .selector('.MuiTab-root[role="tab"]')
  .locator((element) => (element.innerText || element.getAttribute("aria-label")) ?? "")
  .filters({
    disabled: {
      apply: (element) => element.disabled,
      default: false,
    },
    active: (element) => element.getAttribute("aria-selected") == "true",
  });

export const Tabs = createInteractor<HTMLElement>("MUI Tabs")
  .selector(".MuiTabs-root")
  .locator(
    (element) => element.querySelector('.MuiTabs-flexContainer[role="tablist"]')?.getAttribute("aria-label") ?? ""
  )
  .filters({
    id: (element) => element.id,
    className: (element) => element.className,
    classList: (element) => Array.from(element.classList),
    value: (element) => {
      const active = element.querySelector('.MuiTab-root[role="tab"][aria-selected="true"]');
      return isHTMLElement(active) ? (active.innerText || active.getAttribute("aria-label")) ?? "" : "";
    },
  })
  .actions({ click: (interactor, value: string) => interactor.find(Tab(value)).click() });
