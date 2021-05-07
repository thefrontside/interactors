import { createInteractor } from "bigtest";
import { isHTMLElement } from "../test/helpers";

const BottomNavigationAction = createInteractor<HTMLButtonElement>("MUI BottomNavigationAction")
  .selector("button.MuiBottomNavigationAction-root")
  .locator((element) => {
    const label = element.querySelector(".MuiBottomNavigationAction-label");
    return isHTMLElement(label) ? label.innerText : "";
  })
  .actions({ click: ({ perform }) => perform((element) => element.click()) });

export const BottomNavigation = createInteractor<HTMLElement>("MUI BottomNavigation")
  .selector(".MuiBottomNavigation-root")
  .filters({
    value: (element) => {
      const selected = element.querySelector(".MuiBottomNavigationAction-label.Mui-selected");
      return isHTMLElement(selected) ? selected.innerText : "";
    },
  })
  .actions({
    navigate: (interactor, value: string) => interactor.find(BottomNavigationAction(value)).click(),
  });
