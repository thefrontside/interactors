import { HTML, innerText } from "@interactors/html";
import { isHTMLElement } from "./helpers.ts";

const SnackbarInteractor = HTML.extend("MUISnackbar")
  .selector('[class*="MuiSnackbar-root"]')
  .locator((element) => {
    let messageElement = element.querySelector('[class*="MuiSnackbarContent-message"]');
    return isHTMLElement(messageElement) ? innerText(messageElement) : "";
  });

/**
 * Call this {@link InteractorConstructor} to initialize a snackbar {@link Interactor}.
 * The snackbar interactor can be used to assert on snackbars state.
 *
 * The snackbar is located by the visible text of content message.
 *
 * ### Example
 *
 * ``` typescript
 * await Snackbar('I love snacks').exists();
 * ```
 *
 * ### Filters
 *
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 *
 * @category Interactor
 */
export const Snackbar = SnackbarInteractor;
