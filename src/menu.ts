import { Button, createInteractor } from "bigtest";

export const MenuItem = createInteractor<HTMLElement>("MUI MenuItem")
  .selector('li.MuiMenuItem-root[role="menuitem"]')
  .locator((element) => element.innerText)
  .filters({
    disabled: {
      apply: (element) => element.getAttribute("aria-disabled") == "true",
      default: false,
    },
  })
  .actions({ click: ({ perform }) => perform((element) => element.click()) });

export const MenuList = createInteractor<HTMLElement>("MUI MenuList")
  .selector('.MuiPopover-root[role="presentation"] > .MuiMenu-paper > ul.MuiMenu-list[role="menu"]')
  .locator((element) => element.parentElement?.parentElement?.id ?? "");

export const Menu = Button.extend("MUI Menu")
  .selector(`${Button().options.specification.selector as string}[aria-haspopup="true"]`)
  .actions({
    open: async ({ perform }) => perform((element) => element.click()),
    click: async (interactor, value: string) => {
      let menuId = "";
      await interactor.perform((element) => element.click());
      await interactor.perform((element) => (menuId = element.getAttribute("aria-controls") ?? ""));
      await MenuList(menuId).find(MenuItem(value)).click();
    },
  });
