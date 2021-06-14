import { Button, createInteractor, HTML } from "@bigtest/interactor";
import { applyGetter } from "./helpers";

export const MenuItem = HTML.extend<HTMLElement>("MUI MenuItem")
  .selector('.MuiMenuItem-root[role="menuitem"]')
  .locator((element) => element.innerText)
  .filters({
    disabled: {
      apply: (element) => element.getAttribute("aria-disabled") == "true",
      default: false,
    },
  })
  .actions({ click: ({ perform }) => perform((element) => element.click()) });

export const MenuList = createInteractor<HTMLElement>("MUI MenuList")
  .selector('.MuiPopover-root[role="presentation"] > .MuiMenu-paper > .MuiMenu-list[role="menu"]')
  .locator((element) => element.parentElement?.parentElement?.id ?? "");

export const Menu = Button.extend("MUI Menu")
  .selector(`${Button().options.specification.selector as string}[aria-haspopup="true"]`)
  .actions({
    open: async ({ perform }) => perform((element) => element.click()),
    click: async (interactor, value: string) => {
      await interactor.perform((element) => element.click());

      const menuId = await applyGetter(interactor, (element) => element.getAttribute("aria-controls") ?? "");

      await MenuList(menuId).find(MenuItem(value)).click();
    },
  });
