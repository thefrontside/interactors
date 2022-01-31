import { HTML } from "@interactors/html";
import { isHTMLElement } from "./helpers";

const PopoverInteractor = HTML.extend("MUIPopover")
  .selector('[class*="MuiPopover-root"][role="presentation"]')
  .actions({
    close: ({ perform }) =>
      perform((element) => {
        let trapElement = element.firstElementChild;
        if (isHTMLElement(trapElement)) trapElement.click();
      }),
  });

/**
 * Call this {@link InteractorConstructor} to initialize a popover {@link Interactor}.
 * The popover interactor can be used to interact with popover on the page and
 * to assert on their state.
 *
 * The popover is located by the text of its label or by title text content.
 *
 * ### Example
 *
 * ``` typescript
 * await Popover().close();
 * ```
 *
 * ### Filters
 *
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 *
 * ### Actions
 *
 * - `close()`: *{@link Interaction}* – Close the popover
 *
 * @category Interactor
 */
export const Popover = PopoverInteractor;
