import { HTML } from './html';

const LegendInteractor = HTML.extend<HTMLLegendElement>('legend').selector('legend');

const FieldSetInteractor = HTML.extend<HTMLHeadingElement>('fieldset')
  .selector('fieldset')
  .locator(LegendInteractor().text());

/**
 * Call this {@link InteractorConstructor} to initialize a field set {@link Interactor}.
 * The field set interactor can be used to find field sets on the page. This is often useful
 * to scope form fields.
 *
 * ### Example
 *
 * ``` typescript
 * await FieldSet('Shipping Address').find(TextField('City')).fillIn('London');
 * ```
 *
 * ### Filters
 *
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 *
 * @category Interactor
 */
export const FieldSet = FieldSetInteractor;
