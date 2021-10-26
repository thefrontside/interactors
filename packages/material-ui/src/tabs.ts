import { HTML } from "@interactors/html";
import { isDisabled, isHTMLElement } from "./helpers";

const TabInteractor = HTML.extend<HTMLElement>("MUI Tab")
  .selector('[class*="MuiTab-root"][role="tab"]')
  .locator((element) => element.getAttribute("aria-label") ?? element.innerText)
  .filters({
    active: (element) => element.getAttribute("aria-selected") == "true",
    disabled: {
      apply: isDisabled,
      default: false,
    },
  });

const TabsInteractor = HTML.extend<HTMLElement>("MUI Tabs")
  .selector('[class*="MuiTabs-root"]')
  .locator(
    (element) =>
      element.querySelector('[class*="MuiTabs-flexContainer"][role="tablist"]')?.getAttribute("aria-label") ?? ""
  )
  .filters({
    value: (element) => {
      let active = element.querySelector('[class*="MuiTab-root"][role="tab"][aria-selected="true"]');
      return isHTMLElement(active) ? active.getAttribute("aria-label") ?? active.innerText : "";
    },
  })
  .actions({ click: (interactor, value: string) => interactor.find(TabInteractor(value)).click() });

/**
 * Call this {@link InteractorConstructor} to initialize a tab {@link Interactor}.
 * The tab interactor can be used to interact with tabs on the page and
 * to assert on their state.
 *
 * The tab is located by the text of its label or by text content.
 *
 * ### Example
 *
 * ``` typescript
 * await Tab('Preview').click();
 * await Tab({ id: 'preview-tab' }).exists();
 * ```
 *
 * ### Filters
 *
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `disabled`: *boolean* – Filter by whether the tab is disabled. Defaults to `false`.
 * - `active`: *boolean* – Filter by whether the tab is active.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the tab
 *
 * @category Interactor
 */
export const Tab = TabInteractor;

/**
 * Call this {@link InteractorConstructor} to initialize a tabs {@link Interactor}.
 * The tabs interactor can be used to interact with tabs containers on the page and
 * to assert on their state.
 *
 * The tabs is located by the `aria-label` attribute.
 *
 * ### Example
 *
 * ``` typescript
 * await Tab('View modes').click();
 * await Tab({ value: 'preview' }).exists();
 * ```
 *
 * ### Filters
 *
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `disabled`: *boolean* – Filter by whether the tabs are disabled. Defaults to `false`.
 * - `value`: *string* – Filter by the active tab.
 *
 * ### Actions
 *
 * - `click(value: string)`: *{@link Interaction}* – Click on the specific tab
 *
 * @category Interactor
 */
export const Tabs = TabsInteractor;
