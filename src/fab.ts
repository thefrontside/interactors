import { Button } from "@bigtest/interactor";

export const Fab = Button.extend("MUI Fab Button")
  .selector('button[class*="MuiFab-root"]')
  .locator((element) => element.getAttribute("aria-label") ?? element.innerText)
  .filters({
    svgIcon: (el) => el.querySelector("svg")?.classList.toString().includes("MuiSvgIcon-root"),
  });
