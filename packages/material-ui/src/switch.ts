import { Checkbox } from "./checkbox";

const SwitchInteractor = Checkbox.extend("MUISwitch").selector('[class*="MuiSwitch-input"]');

/**
 * Call this {@link InteractorConstructor} to initialize a switch {@link Interactor}.
 * The switch interactor can be used to interact with switches on the page and
 * to assert on their state.
 *
 * The switch is located by the text of its label or by `aria-label` attribute.
 *
 * ### Example
 *
 * ``` typescript
 * await Switch('Theme').toggle();
 * await Switch('Theme').is({ disabled: true });
 * await Switch({ id: 'theme-toggler', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `valid`: *boolean* – Filter by whether the switch is valid.
 * - `checked`: *boolean* – Filter by whether the switch is checked..
 * - `disabled`: *boolean* – Filter by whether the switch is disabled. Defaults to `false`.
 * - `focused`: *boolean* – Filter by whether the switch is focused. See {@link focused}.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the switch
 * - `focus()`: *{@link Interaction}* – Focus the switch
 * - `blur()`: *{@link Interaction}* – Blur the switch
 * - `check()`: *{@link Interaction}* – Check the switch if it is not checked
 * - `uncheck()`: *{@link Interaction}* – Uncheck the switch if it is checked
 * - `toggle()`: *{@link Interaction}* – Toggle the switch
 *
 * @category Interactor
 */
export const Switch = SwitchInteractor;
