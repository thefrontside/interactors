import { Button, Button as BaseButton } from "@bigtest/interactor";
// import { Button } from '@bigtest/interactor';

// // TODO Merge with #4
// export const Button = BaseButton.extend("MUI Button").filters({
//   label: (element) => element.getAttribute("aria-label") ?? "",
// });

export const MaterialButton = Button.extend("material-ui button")
// export default Button.extend('button')
export default Button.extend('button')
  .filters({
    iconLabel: (el) => el.querySelector(".MuiButton-label")?.firstElementChild?.classList.value,
    customRippleClass: (el) => {
      const classes: string[] = []
      const spans = el.querySelectorAll('span');
      spans.forEach((span) => {
        classes.push(span.classList.value)
      });

      return classes.join(" ")
    },
    rippleEnabled: (el) => !!el.querySelector(".MuiTouchRipple-root"),
    touchRipple: (el) => !!(el).querySelector(".MuiTouchRipple-ripple"),
    rippleVisible: (el) => !!(el).querySelector(".MuiTouchRipple-rippleVisible")
  })
