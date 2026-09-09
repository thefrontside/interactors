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
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }),
  });

export const Form = createInteractor<HTMLFormElement>("form")
  .selector("form")
  .locator((element) => element.id);

export const MultiSelect = createInteractor<HTMLSelectElement>("multi select")
  .selector("select[multiple]")
  .filters({
    values: (element) =>
      [...element.selectedOptions].map((option) => option.value),
  });

export const sameLength = createMatcher("same length", (expected: string) => ({
  match: (actual: string) => actual.length === expected.length,
  description: () => `same length as ${JSON.stringify(expected)}`,
}));

export const ignored = "not a remote definition";
