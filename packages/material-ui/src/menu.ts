import { click, HTML, createInteractor } from "@interactors/html";
import { Button } from "./button.ts";
import { isDisabled } from "./helpers.ts";

const MenuItemInteractor = HTML.extend<HTMLElement>("MUIMenuItem")
  .selector('[class*="MuiMenuItem-root"][role="menuitem"]')
  .filters({
    disabled: {
      apply: isDisabled,
      default: false,
    },
  })
  .actions({ click: ({ perform }) => perform((element) => click(element)) });

const MenuListInteractor = createInteractor<HTMLElement>("MUIMenuList")
  .selector(
    '[class*="MuiPopover-root"][role="presentation"] > [class*="MuiMenu-paper"] > [class*="MuiMenu-list"][role="menu"]'
  )
  .locator((element) => element.parentElement?.parentElement?.id ?? "");

const MenuInteractor = Button.extend("MUIMenu")
  .selector(`${Button().options.specification.selector as string}[aria-haspopup="true"]`)
  .filters({ menuId: (element) => element.getAttribute("aria-controls") ?? "" })
  .actions({
    open: async ({ perform }) => await perform((element) => click(element)),
    click: async (interactor, value: string) => {
      await interactor.perform((element) => click(element));

      await MenuListInteractor(await interactor.menuId()).find(MenuItemInteractor(value)).click();
    },
  });

/**
 * Call this {@link InteractorConstructor} to initialize a menu {@link
 * Interactor}. The menu interactor can be used to interact with menus
 * on the page and to assert on their state.
 *
 * The menu is located by the `aria-label` attribute or the visible text on the menu in otherwise.
 *
 * ### Example
 *
 * ``` typescript
 * await Menu('Options').open();
 * await Menu('Options').is({ disabled: true });
 * await Menu({ id: 'options', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `disabled`: *boolean* – Filter by whether the menu is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the menu is focused. See {@link focused}.
 *
 * ### Actions
 *
 * - `open()`: *{@link Interaction}* – Open the menu
 * - `click(value: string)`: *{@link Interaction}* – Click on the menu's item
 * - `focus()`: *{@link Interaction}* – Move focus to the menu
 * - `blur()`: *{@link Interaction}* – Move focus away from the menu
 *
 * @category Interactor
 */
export const Menu = MenuInteractor;

export const MenuList = MenuListInteractor;

/**
 * Call this {@link InteractorConstructor} to initialize a menu item {@link
 * Interactor}. The menu item interactor can be used to interact with items
 * on the page and to assert on their state.
 *
 * The menu item is located by the visible text on the item.
 *
 * ### Example
 *
 * ``` typescript
 * await MenuItem('Edit').click();
 * await MenuItem({ id: 'edit', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `disabled`: *boolean* – Filter by whether the item is disabled. Defaults to `false`.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the menu item
 *
 * @category Interactor
 */
export const MenuItem = MenuItemInteractor;
