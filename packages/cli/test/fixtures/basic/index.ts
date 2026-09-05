import { createInteractor, createMatcher } from "@interactors/core";

export const TextField = createInteractor<HTMLInputElement>("text field")
  .selector("input")
  .locator((element) => element.id)
  .filters({
    disabled: (element) => element.disabled,
    value: (element) => element.value,
  })
  .actions({
    fillIn: ({ perform }, value: string) =>
      perform((element) => {
        element.value = value;
      }),
  });

export const Button = createInteractor<HTMLButtonElement>("button")
  .selector("button")
  .locator((element) => element.textContent ?? "")
  .filters({
    disabled: (element) => element.disabled,
  })
  .actions({
    click: ({ perform }) => perform((element) => element.click()),
  });

export const Form = createInteractor<HTMLFormElement>("form")
  .selector("form")
  .locator((element) => element.id);

export const sameLength = createMatcher("same length", (expected: string) => ({
  match: (actual: string) => actual.length === expected.length,
  description: () => `same length as ${JSON.stringify(expected)}`,
}));

export const ignored = () => "not an interactor";
