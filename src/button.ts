import { HTML } from "@bigtest/interactor";

export const Button = HTML.extend<HTMLButtonElement | HTMLLinkElement>("MUI Button")
  .selector(
    ["button", "a[href]", '[role="button"]']
      .map((selector) => `${selector}[class*="MuiButton-root"], ${selector}[class*="MuiIconButton-root"]`)
      .join(", ")
  )
  .locator((element) => element.getAttribute("aria-label") ?? element.innerText)
  .filters({
    href: (element) => element.getAttribute("href"),
    disabled: {
      apply: (element) => element.disabled || element.getAttribute("aria-disabled") == "true",
      default: false,
    },
  });
