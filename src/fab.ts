import { Button } from '@bigtest/interactor';

export default Button.extend('button')
  .filters({
    embeddedIcon: (el) => !!el.querySelector('.MuiIcon-root')
  })