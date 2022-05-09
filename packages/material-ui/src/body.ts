import { HTML } from "@interactors/html";

export const Body = HTML.extend<HTMLBodyElement>("Body")
  .selector("body")
  .actions({
    click: async ({ perform }) =>
      perform((element) => {
        if (document.activeElement && "blur" in document.activeElement) {
          (document.activeElement as HTMLElement).blur();
        }
        element.click();
      }),
  });
