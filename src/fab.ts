import { Button } from '@bigtest/interactor';

export default Button.extend('button')
  .filters({
    ariaLabel: (el) => el.getAttribute("aria-label")
  })