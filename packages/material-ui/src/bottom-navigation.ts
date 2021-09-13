import { createInteractor } from "@interactors/html";
import { isHTMLElement } from "./helpers";

const BottomNavigationAction = createInteractor<HTMLButtonElement>("MUI BottomNavigationAction")
  .selector('button[class*="MuiBottomNavigationAction-root"]')
  .locator((element) => {
    let label = element.querySelector('[class*="MuiBottomNavigationAction-label"]');
    return isHTMLElement(label) ? label.innerText : "";
  })
  .actions({ click: ({ perform }) => perform((element) => element.click()) });

export const BottomNavigation = createInteractor<HTMLElement>("MUI BottomNavigation")
  .selector('[class*="MuiBottomNavigation-root"]')
  .filters({
    value: (element) => {
      let selected = element.querySelector('[class*="MuiBottomNavigationAction-label"][class*="Mui-selected"]');
      return isHTMLElement(selected) ? selected.innerText : "";
    },
  })
  .actions({
    navigate: (interactor, value: string) => interactor.find(BottomNavigationAction(value)).click(),
  });
