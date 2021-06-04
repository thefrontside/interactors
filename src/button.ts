import { Button as BaseButton } from "@bigtest/interactor";

// TODO Merge with #4
export const Button = BaseButton.extend("MUI Button").filters({
  label: (element) => element.getAttribute("aria-label") ?? "",
});
