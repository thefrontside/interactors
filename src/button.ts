import { HTML } from "@bigtest/interactor";

// // TODO Merge with #4
// export const Button = BaseButton.extend("MUI Button").filters({
//   label: (element) => element.getAttribute("aria-label") ?? "",
// });

export const Button = HTML.extend<HTMLButtonElement | HTMLLinkElement>('MUI Button')
  .selector('.MuiButton-root')
  .filters({
    iconLabel: (el) => el.querySelector(".MuiButton-label")?.firstElementChild?.classList.value,
    href: (el) => el.getAttribute('href'),
    disabled: (el) => el.disabled,
  })

