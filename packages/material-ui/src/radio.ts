import { isVisible } from "@interactors/core";
import { RadioButton } from "@interactors/html";
import { isHTMLElement } from "./helpers";

const RadioInteractor = RadioButton.extend("radio")
  .selector('[class*="MuiRadio-root"] input[type=radio]')
  .filters({
    visible: {
      apply: (element) => {
        let closest = element.closest('[class*="MuiRadio-root"]');
        return isHTMLElement(closest) ? isVisible(closest) : false;
      },
      default: true,
    },
  });

/**
 * Call this {@link InteractorConstructor} to initialize a radio button {@link Interactor}.
 * The radio button interactor can be used to interact with radio buttons on the page and
 * to assert on their state.
 *
 * The radio button is located by the text of its label.
 *
 * ### Example
 *
 * ``` typescript
 * await RadioButton('Public').click();
 * await RadioButton('Private').is({ disabled: true });
 * await RadioButton({ id: 'privacy-public', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `valid`: *boolean* – Filter by whether the radio button is valid.
 * - `checked`: *boolean* – Filter by whether the radio button is checked.
 * - `disabled`: *boolean* – Filter by whether the radio button is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the radio button is focused. See {@link focused}.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the radio button
 * - `choose()`: *{@link Interaction}* – Click on the radio button
 * - `focus()`: *{@link Interaction}* – Focus the radio button
 * - `blur()`: *{@link Interaction}* – Blur the radio button
 *
 * @category Interactor
 */
export const Radio = RadioInteractor;
