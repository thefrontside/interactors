import { HTML } from 'bigtest';

export default HTML.extend('slider')
  .selector('span[role="slider"]')
  .filters({
    ariaValueNow: (el) => {
      return el.getAttribute('aria-valuenow')
    },
    dataIndex: (el) => el.getAttribute('data-index'),
    index: (el) => {
      const parent = el.parentNode;
      const sliderNodes = parent?.querySelectorAll('span[role="slider"]') || [];

      for (let i = 0; i < sliderNodes?.length; i++) {
        if (el === sliderNodes[i]) {
          return i;
        }
      }
      return undefined;
    }
  })
  .actions({
    keyThumb: ({ perform }, key) => perform((el) => {
      const keyCodes: { [key: string]: number; }= { "ArrowRight": 39, "ArrowLeft": 37}
      el.dispatchEvent(new KeyboardEvent('keydown', {
        keyCode: keyCodes[key],
        key: `${key}`,
        code: `${key}`,
        bubbles: true,
        cancelable: true
      }))
    })
  })
