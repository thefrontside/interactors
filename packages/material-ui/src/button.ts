import { HTML, innerText } from "@interactors/html";
import { isDisabled } from "./helpers";

const ButtonInteractor = HTML.extend<HTMLButtonElement | HTMLLinkElement>("MUIButton")
  .selector(
    ["button", "a[href]", '[role="button"]']
      .map((selector) => `${selector}[class*="MuiButton-root"], ${selector}[class*="MuiIconButton-root"]`)
      .join(", ")
  )
  .locator((element) => element.getAttribute("aria-label") ?? innerText(element))
  .filters({
    href: (element) => element.getAttribute("href"),
    disabled: {
      apply: (element) => element.disabled || isDisabled(element),
      default: false,
    },
  });

/**
 * Call this {@link InteractorConstructor} to initialize a button {@link Interactor}.
 * The button interactor can be used to interact with buttons on the page and
 * to assert on their state.
 *
 * The button is located by the `aria-label` attribute or the visible text on the button in otherwise.
 *
 * ### Example
 *
 * ``` typescript
 * await Button('Submit').click();
 * await Button('Submit').is({ disabled: true });
 * await Button({ id: 'submit-button', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `disabled`: *boolean* – Filter by whether the button is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the button is focused. See {@link focused}.
 * - `href`: *string* - Filter by href if it's button link
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the button
 * - `focus()`: *{@link Interaction}* – Move focus to the button
 * - `blur()`: *{@link Interaction}* – Move focus away from the button
 *
 * @category Interactor
 */
export const Button = ButtonInteractor;
