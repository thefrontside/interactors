import { HTML, createInteractor } from 'bigtest';

export default HTML.extend('slider')
  .selector('span[role="slider"]')
  .filters({
    ariaValueNow: (el) => {
      return el.getAttribute('aria-valuenow')
    },
    index: (el) => el.getAttribute('data-index'),
  })
  .actions({
    keyboard: ({ perform }, key) => perform((el) => {
      const keyCodes: { [key: string]: number; }= { "ArrowRight": 39, "ArrowLeft": 37}
      el.dispatchEvent(new KeyboardEvent('keydown', {
        keyCode: keyCodes[key],
        key: `${key}`,
        code: `${key}`,
        bubbles: true,
        cancelable: true
      }))
    }),
    mouseDown: ({ perform }, clientX: number) => perform((el) => {
      console.log('Parent parentElement', el.parentElement)
      el.dispatchEvent(new MouseEvent('mousedown', { clientX: clientX, bubbles: true, cancelable: true }))
    }),
    mouseUp: ({ perform }, clientX: number) => perform((el) => {
      el.dispatchEvent(new MouseEvent('mouseup', { clientX: clientX, cancelable: true, bubbles: true }))
    })
  })
