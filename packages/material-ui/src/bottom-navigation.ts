import { click, createInteractor, innerText } from "@interactors/html";
import { isHTMLElement } from "./helpers";

const BottomNavigationAction = createInteractor<HTMLButtonElement>("MUIBottomNavigationAction")
  .selector('button[class*="MuiBottomNavigationAction-root"]')
  .locator((element) => {
    let label = element.querySelector('[class*="MuiBottomNavigationAction-label"]');
    return isHTMLElement(label) ? innerText(label) : "";
  })
  .actions({ click: ({ perform }) => perform((element) => click(element)) });

const BottomNavigationInteractor = createInteractor<HTMLElement>("MUIBottomNavigation")
  .selector('[class*="MuiBottomNavigation-root"]')
  .filters({
    value: (element) => {
      let selected = element.querySelector('[class*="MuiBottomNavigationAction-label"][class*="Mui-selected"]');
      return isHTMLElement(selected) ? innerText(selected) : "";
    },
  })
  .actions({
    navigate: (interactor, value: string) => interactor.find(BottomNavigationAction(value)).click(),
  });

/**
 * Call this {@link InteractorConstructor} to initialize a bottom navigation {@link Interactor}.
 * The bottom navigation interactor can be used to interact with bottom navigation on the page and
 * to assert on their state.
 *
 * The bottom navigation can be located by `value` filter.
 *
 * ### Example
 *
 * ``` typescript
 * await BottomNavigation().navigate('Favorites');
 * await BottomNavigation().has({ value: 'Recents' });
 * await BottomNavigation({ value: 'Nearby' }).exists();
 * ```
 *
 * ### Filters
 *
 * - `value`: *string* – Filter by value
 *
 * ### Actions
 *
 * - `navigate(value: string)`: *{@link Interaction}* – Navigate to new destination
 *
 * @category Interactor
 */
export const BottomNavigation = BottomNavigationInteractor;
