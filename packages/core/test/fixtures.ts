import { createInteractor } from "../src";

export const Link = createInteractor<HTMLLinkElement>("link")
  .selector("a")
  .filters({
    href: (element) => element.href,
    title: (element) => element.title,
  })
  .actions({
    click: ({ perform }) =>
      perform((element) => {
        element.click();
      }),
    setHref: ({ perform }, value: string) =>
      perform((element) => {
        element.href = value;
      }),
  });

export const Header = createInteractor("header")
  .selector("h1,h2,h3,h4,h5,h6")
  .filters({
    text: (e) => e.textContent,
  });

export const Div = createInteractor("div")
  .selector("div")
  .locator((element) => element.id || "");

export const Details = createInteractor<HTMLDetailsElement>("details")
  .selector("details")
  .locator((element) => element.querySelector("summary")?.textContent || "");

export const TextField = createInteractor<HTMLInputElement>("text field")
  .selector("input")
  .locator((element) => element.id)
  .filters({
    id: (element) => element.id,
    placeholder: (element) => element.placeholder,
    enabled: {
      apply: (element) => !element.disabled,
      default: true,
    },
    value: (element) => element.value,
    focused: (element) => document.activeElement == element,
    body: (element) => element.ownerDocument.body,
    scroll: (element) => element.scrollIntoView,
    rect: (element) => element.getBoundingClientRect(),
  })
  .actions({
    fillIn: ({ perform }, value: string) =>
      perform((element) => {
        element.value = value;
      }),
    click: ({ perform }) =>
      perform((element) => {
        element.click();
      }),
  })
  .actions({
    append: async ({ value: currentValue, fillIn }, value: string) => fillIn(`${await currentValue()}${value}`),
  });

export const Calendar = createInteractor<HTMLElement>("calendar").selector("div.calendar");

export const Datepicker = createInteractor<HTMLDivElement>("datepicker")
  .selector("div.datepicker")
  .locator((element) => element.querySelector("label")?.textContent || "")
  .filters({
    open: Calendar().exists(),
    month: Calendar().find(Header()).text(),
  })
  .actions({
    toggle: async (interactor) => {
      await interactor.find(TextField({ placeholder: "YYYY-MM-DD" })).click();
    },
  });

export const MainNav = createInteractor("main nav").selector("nav");

export const HTML = createInteractor<HTMLElement>("element")
  .filters({
    title: (element) => element.title,
  })
  .actions({
    click: ({ perform }) =>
      perform((element) => {
        element.click();
      }),
  });

export const Thing = HTML.extend<HTMLLinkElement>("div")
  .selector("div")
  .filters({
    title: (element) => parseInt(element.dataset.title || "0"),
  })
  .actions({
    click(interactor, value: number) {
      return interactor.perform((element) => {
        element.dataset.title = value.toString();
      });
    },
  });
