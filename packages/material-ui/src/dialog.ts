import { HTML } from "@interactors/html";
import { userEvent } from "@interactors/core/testing-library";
import { isHTMLElement } from "./helpers";

const DialogInteractor = HTML.extend("MUI Dialog")
  .selector('[class*="MuiDialog-root"][role="presentation"]:not([aria-hidden="true"])')
  .locator((element) => {
    let labelId = element.querySelector('[class*="MuiDialog-paper"][role="dialog"]')?.getAttribute("aria-labelledby");
    let titleElement = labelId
      ? element.querySelector(`#${labelId}`)
      : element.querySelector('[class*="MuiDialogTitle-root"]');
    return isHTMLElement(titleElement) ? titleElement.innerText : "";
  })
  .actions({
    close: ({ perform }) =>
      perform((element) => {
        let backdrop = element.querySelector('[class*="MuiBackdrop-root"]');
        if (isHTMLElement(backdrop)) userEvent.click(backdrop);
      }),
  });

/**
 * Call this {@link InteractorConstructor} to initialize a dialog {@link Interactor}.
 * The dialog interactor can be used to interact with dialog windows on the page and
 * to assert on their state.
 *
 * The dialog is located by the text of its label or by title text content.
 *
 * ### Example
 *
 * ``` typescript
 * await Dialog('Login').close();
 * await Dialog({ id: 'login-modal' }).exists();
 * ```
 *
 * ### Filters
 *
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 *
 * ### Actions
 *
 * - `close()`: *{@link Interaction}* – Close the dialog window
 *
 * @category Interactor
 */
export const Dialog = DialogInteractor;
