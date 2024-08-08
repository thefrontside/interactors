import { HTML } from './html.ts';

const SummaryInteractor = HTML.extend('Summary').selector('summary');

const DetailsInteractor = HTML.extend<HTMLDetailsElement>('Details')
  .locator(SummaryInteractor().text())
  .selector('details')
  .filters({
    open: (element) => element.open,
  })
  .actions({
    async toggle(interactor) {
      await interactor.find(SummaryInteractor()).click();
    }
  });

/**
 * Call this {@link InteractorConstructor} to initialize a details {@link Interactor}. Which
 * locates `details` tags by their summary.
 *
 * ### Example
 *
 * ``` typescript
 * await Details('Show more').toggle();
 * await Details('Show more').is({ open: true });
 * ```
 *
 * ### Filters
 *
 * - `open`: *boolean* – Whether the details tag is open
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 *
 * ### Actions
 *
 * - `toggle()`: *{@link Interaction}* – show/hide the details
 *
 * @category Interactor
 */
export const Details = DetailsInteractor;
