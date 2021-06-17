import { createInteractor } from "@bigtest/interactor";
import { isHTMLElement } from "./helpers";

const BottomNavigationAction = createInteractor<HTMLButtonElement>("MUI BottomNavigationAction")
  .selector('button[class*="MuiBottomNavigationAction-root"]')
  .locator((element) => {
    const label = element.querySelector('[class*="MuiBottomNavigationAction-label"]');
    return isHTMLElement(label) ? label.innerText : "";
  })
  .actions({ click: ({ perform }) => perform((element) => element.click()) });

export const BottomNavigation = createInteractor<HTMLElement>("MUI BottomNavigation")
  .selector('[class*="MuiBottomNavigation-root"]')
  .filters({
    value: (element) => {
      const selected = element.querySelector('[class*="MuiBottomNavigationAction-label"][class*="Mui-selected"]');
      return isHTMLElement(selected) ? selected.innerText : "";
    },
  })
  .actions({
    navigate: (interactor, value: string) => interactor.find(BottomNavigationAction(value)).click(),
  });
