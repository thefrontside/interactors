import { Button } from '@bigtest/interactor';

export default Button.extend('button')
  .selector('button.MuiFab-root')
  .filters({
    ariaLabel: (el) => el.getAttribute("aria-label"),
    svgIcon: (el) => el.querySelector('svg')?.classList.contains('MuiSvgIcon-root')
  })