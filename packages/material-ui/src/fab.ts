import { Button } from "@interactors/html";

export const Fab = Button.extend("MUI Fab Button")
  .selector('button[class*="MuiFab-root"]')
  .locator((element) => element.getAttribute("aria-label") ?? element.innerText)
  .filters({
    svgIcon: (element) => element.querySelector("svg")?.classList.toString().includes("MuiSvgIcon-root") ?? false,
  });
