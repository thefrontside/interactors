import { HTML, Button as BaseButton } from "@bigtest/interactor";

// TODO Merge with #4
export const Button = BaseButton.extend("MUI Button").filters({
  label: (element) => element.getAttribute("aria-label") ?? "",
});

export const MaterialButton = Button.extend("material-ui button")
// export default Button.extend('button')
