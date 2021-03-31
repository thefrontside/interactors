import { HTML } from "bigtest";

export const Body = HTML.extend<HTMLBodyElement>("body")
  .selector("body")
  .actions({
    click: ({ perform }) =>
      perform((element) => {
        if (document.activeElement && "blur" in document.activeElement) {
          (document.activeElement as HTMLElement).blur();
        }
        element.click();
      }),
  });
