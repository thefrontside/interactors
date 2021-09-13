import { HTML } from "@interactors/html";
import { isHTMLElement } from "./helpers";

export const Snackbar = HTML.extend("MUI Snackbar")
  .selector('[class*="MuiSnackbar-root"]')
  .locator((element) => {
    let messageElement = element.querySelector('[class*="MuiSnackbarContent-message"]');
    return isHTMLElement(messageElement) ? messageElement.innerText : "";
  });
