import { HTML, innerText } from "@interactors/html";

const ListInteractor = HTML.extend<HTMLElement>("MUIList")
  .locator((element) => element.getAttribute("aria-label") ?? innerText(element))
  .selector('[class*="MuiList-root"]');

const ListItemInteractor = HTML.extend<HTMLElement>("MUIListItem")
  .selector('[class*="MuiListItem-root"]')
  .filters({
    disabled: {
      apply: (element) => element.hasAttribute("disabled") || element.getAttribute("aria-disabled") == "true",
      default: false,
    },
    index: (element) => Array.from(element.parentElement?.children ?? []).indexOf(element),
  });

/**
 * Call this {@link InteractorConstructor} to initialize a list {@link
 * Interactor}. The list interactor can be used to assert on lists state.
 *
 * The list is located by the `aria-label` attribute or by text content.
 *
 * ### Example
 *
 * ``` typescript
 * await List('ToDos').exists();
 * ```
 *
 * ### Filters
 *
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 *
 * @category Interactor
 */
export const List = ListInteractor;

/**
 * Call this {@link InteractorConstructor} to initialize a list item {@link
 * Interactor}. The list item interactor can be used to interact with items
 * on the page and to assert on their state.
 *
 * The list item is located by the visible text on the item.
 *
 * ### Example
 *
 * ``` typescript
 * await ListItem('Install `@interactors/material-ui`').click();
 * await ListItem({ index: 2, disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `disabled`: *boolean* – Filter by whether the item is disabled. Defaults to `false`.
 * - `index`: *number* - Filter by the item's zero-based index position in a list.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the list item
 *
 * @category Interactor
 */
export const ListItem = ListItemInteractor;
