import { HTML } from "@bigtest/interactor";

export const List = HTML.extend<HTMLElement>("MUI List")
  .locator((element) => element.getAttribute("aria-label") ?? element.innerText)
  .selector('[class*="MuiList-root"]');

export const ListItem = HTML.extend<HTMLElement>("MUI ListItem")
  .selector('[class*="MuiListItem-root"]')
  .filters({
    disabled: {
      apply: (element) => element.hasAttribute("disabled") || element.getAttribute("aria-disabled") == "true",
      default: false,
    },
    index: (element) => Array.from(element.parentElement?.children ?? []).indexOf(element),
  });
