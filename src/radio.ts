import { RadioButton, isVisible } from '@bigtest/interactor';

export default RadioButton.extend('radio')
  .selector('.MuiRadio-root input[type=radio]')
  .filters({
    visible: {
      apply: (el) => isVisible(el.closest('.MuiRadio-root')!),
      default: true
    }
  })