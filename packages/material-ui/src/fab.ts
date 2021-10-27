import { Button } from "@interactors/html";

const FabInteractor = Button.extend("MUI Fab Button")
  .selector('button[class*="MuiFab-root"]')
  .locator((element) => element.getAttribute("aria-label") ?? element.innerText)
  .filters({
    svgIcon: (element) => element.querySelector("svg")?.classList.toString().includes("MuiSvgIcon-root") ?? false,
  });

/**
 * Call this {@link InteractorConstructor} to initialize a floating action button {@link Interactor}.
 * The fab interactor can be used to interact with fabs on the page and
 * to assert on their state.
 *
 * The fab is located by the `aria-label` attribute or the visible text on the fab in otherwise.
 *
 * ### Example
 *
 * ``` typescript
 * await Fab('add').click();
 * await Fab('add').is({ disabled: true });
 * await Fab({ id: 'add-button', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `disabled`: *boolean* – Filter by whether the fab is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the fab is focused. See {@link focused}.
 * - `svgIcon`: *boolean* - Filter by whether the fab has icon.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the fab
 * - `focus()`: *{@link Interaction}* – Move focus to the fab
 * - `blur()`: *{@link Interaction}* – Move focus away from the fab
 *
 * @category Interactor
 */
export const Fab = FabInteractor;
