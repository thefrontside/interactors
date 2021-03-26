import { test, Page } from 'bigtest';
import { Radio as Interactor, or} from '../src/index'
import { Radio as MuiRadio } from '@material-ui/core';
import { render } from './helpers';

const radio = Interactor();

export default test("Radio")
  .step(Page.visit("/"))
  .child("can render radio button", (test) => test
    .step("render radio button", async() => {
      await render(<MuiRadio/>)
    })
    .assertion(radio.exists())
    .assertion(radio.is({ checked: false }))
  )
