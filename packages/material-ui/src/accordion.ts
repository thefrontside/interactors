import { HTML, innerText } from "@interactors/html";
import { isDisabled, isHTMLElement } from "./helpers";

const getSummary = (element: HTMLElement) => element.querySelector('[class*="MuiAccordionSummary-root"]');
const isExpanded = (element: HTMLElement) => getSummary(element)?.getAttribute("aria-expanded") == "true";

const AccordionSummary = HTML.extend<HTMLElement>("MUIAccordionSummary")
  .selector('[class*="MuiAccordionSummary-root"]')
  .locator((element) => element.getAttribute("aria-label") ?? innerText(element))
  .filters({
    expanded: (element) => element.getAttribute("aria-expanded") == "true",
    disabled: {
      apply: isDisabled,
      default: false,
    },
  });

const AccordionInteractor = HTML.extend<HTMLElement>("MUIAccordion")
  .selector('[class*="MuiAccordion-root"]')
  .locator((element) => {
    let summary = getSummary(element);
    return isHTMLElement(summary) ? summary.getAttribute("aria-label") ?? innerText(summary) : "";
  })
  .filters({
    expanded: isExpanded,
    disabled: {
      apply: (element) => isDisabled(getSummary(element)),
      default: false,
    },
  })
  .actions({
    expand: async (interactor) => {
      if (await interactor.expanded()) return;

      await interactor.find(AccordionSummary()).click();
    },
    collapse: async (interactor) => {
      if (!(await interactor.expanded())) return;

      await interactor.find(AccordionSummary()).click();
    },
    toggle: async (interactor) => {
      await interactor.find(AccordionSummary()).click();
    }
  });

/**
 * Call this {@link InteractorConstructor} to initialize a accordion {@link Interactor}.
 * The accordion interactor can be used to interact with accordions on the page and
 * to assert on their state.
 *
 * The accordion is located by the `aria-label` attribute or visible text on the accordion's summary in otherwise.
 *
 * ### Example
 *
 * ``` typescript
 * await Accordion('Overview').toggle();
 * await Accordion('Overview').is({ expanded: true });
 * await Accordion({ id: 'overview-accordion', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `disabled`: *boolean* – Filter by whether the accordion is disabled. Defaults to `false`.
 * - `expanded`: *boolean* – Filter by whether the accordion is expanded.
 *
 * ### Actions
 *
 * - `expand()`: *{@link Interaction}* – Expand the accordion
 * - `collapse()`: *{@link Interaction}* – Collapse the accordion
 * - `toggle()`: *{@link Interaction}* – Toggle the accordion
 *
 * @category Interactor
 */
export const Accordion = AccordionInteractor;
