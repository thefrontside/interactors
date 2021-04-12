import { Page, test } from 'bigtest';
import { Slider as Interactor, including } from '../src/index';
import { Slider as MuiSlider, Typography } from '@material-ui/core'
import { render } from './helpers';

const slider = Interactor;

export default test("slider")
  .step(Page.visit("/"))
  .child("render Slider", (test) => test
    .step("render Slider", async() => {
      await render(<MuiSlider defaultValue={20}/>)
    })
    .assertion("we have a slider", async() => {
      slider().exists()
    })
    .assertion(slider({ index: "0"}).exists())
  )
  .child("slider with two thumbs", (test) => test
    .step("render slider with two thumbs", async() => {
      const marks = [
        {
          value: 0,
          label: '0°C',
        },
        {
          value: 20,
          label: '20°C',
        },
        {
          value: 37,
          label: '37°C',
        },
        {
          value: 100,
          label: '100°C',
        },
      ];

      function valuetext(value: any) {
        console.log(value)
        return `${value}°C`;
      }

      await render(
        <div style={{ width: '50em', padding: '1em'}}>
          <Typography id="discrete-slider-always" gutterBottom>
            Always visible
          </Typography>
          <MuiSlider
            defaultValue={[80, 20]}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-always"
            step={10}
            marks={marks}
            valueLabelDisplay="on"
          />
        </div>)
      })
      .child("can control slider thumb with keyboard", (test) => test
        .step('key thumb right', async() => {
          const thumb1 = slider({ index: "0"})
          await thumb1.keyboard("ArrowRight");
        })
        .assertion(slider({ index: "0"}).has({ ariaValueNow: including('30')}))
        .child("key thumb left", (test) => test
        .step('key thumb left', async() => {
          const thumb1 = slider({ index: "0"})
          await thumb1.keyboard("ArrowLeft");
          })
          .assertion(slider({ index: "0"}).has({ ariaValueNow: including('20')}))
        )
      )
      .child("can control slider thumb with mouse", (test) => test
        .step('Mouse click right', async() => {
          const thumb1 = slider({ index: "0"})
          await thumb1.mouseDown(127)
          await thumb1.mouseUp(127)
        })
        .assertion(slider({ index: "0"}).has({ ariaValueNow: including('10')}))
        .child("mouse click left", (test) => test
        .step('click mouse', async() => {
          const thumb1 = slider({ index: "0"})
          await thumb1.mouseDown(200)
          await thumb1.mouseUp(200)
          })
          .assertion(slider({ index: "0"}).has({ ariaValueNow: including('20')}))
        )
        .child("click second thumb", (test) => test
          .step("Something", async() => {
            const thumb2 = slider({ index: "1" })
            await thumb2.mouseDown(900)
            await thumb2.mouseUp(900)
          })
          .assertion(slider({ index: "1"}).has({ ariaValueNow: including('100')}))
        )
      )
  )
  .child("slider with one thumb", (test) => test
    .step("render slider with one thumb", async() => {
      await render(
        <div style={{ width: '50em', padding: '1em'}}>
          <Typography id="discrete-slider-always" gutterBottom>
            Always visible
          </Typography>
          <MuiSlider
            defaultValue={20}
            // getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-always"
            // step={10}
            // marks={marks}
            valueLabelDisplay="on"
          />
        </div>)
    })
    .child("click thumb", (test) => test
      .step('click', async() => {
        const thumb2 = slider({ index: "1" })
      })
    )
  )