import { createInteractor, HTML } from "@interactors/html";
import { userEvent } from "@interactors/html/testing-library";
import { Button } from "./button";
import { applyGetter, isDisabled } from "./helpers";

export const MenuItem = HTML.extend<HTMLElement>("MUI MenuItem")
  .selector('[class*="MuiMenuItem-root"][role="menuitem"]')
  .filters({
    disabled: {
      apply: isDisabled,
      default: false,
    },
  })
  .actions({ click: ({ perform }) => perform((element) => userEvent.click(element)) });

export const MenuList = createInteractor<HTMLElement>("MUI MenuList")
  .selector(
    '[class*="MuiPopover-root"][role="presentation"] > [class*="MuiMenu-paper"] > [class*="MuiMenu-list"][role="menu"]'
  )
  .locator((element) => element.parentElement?.parentElement?.id ?? "");

export const Menu = Button.extend("MUI Menu")
  .selector(`${Button().options.specification.selector as string}[aria-haspopup="true"]`)
  .actions({
    open: async ({ perform }) => perform((element) => userEvent.click(element)),
    click: async (interactor, value: string) => {
      await interactor.perform((element) => userEvent.click(element));

      let menuId = await applyGetter(interactor, (element) => element.getAttribute("aria-controls") ?? "");

      await MenuList(menuId).find(MenuItem(value)).click();
    },
  });
