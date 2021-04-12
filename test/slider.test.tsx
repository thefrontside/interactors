import { Page, test } from 'bigtest';
import { SliderThumb as Interactor, including } from '../src/index';
import { Slider as MuiSlider, Typography } from '@material-ui/core'
import { render } from './helpers';

const sliderThumb = Interactor;

export default test("slider")
  .step(Page.visit("/"))
  .child("render Slider", (test) => test
    .step("render Slider", async() => {
      await render(<MuiSlider defaultValue={20}/>)
    })
    .assertion("we have a slider", async() => {
      sliderThumb().exists()
    })
    .assertion(sliderThumb({ index: "0"}).exists())
  )
  .child("another test", (test) => test
    .step("render", async() => {
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
          const thumb1 = sliderThumb({ index: "0"})
          await thumb1.keyboard("ArrowRight");
        })
        .assertion(sliderThumb({ index: "0"}).has({ ariaValueNow: including('30')}))
        .child("key thumb left", (test) => test
        .step('key thumb left', async() => {
          const thumb1 = sliderThumb({ index: "0"})
          await thumb1.keyboard("ArrowLeft");
          })
          .assertion(sliderThumb({ index: "0"}).has({ ariaValueNow: including('20')}))
        )
      )
      .child("can control slider thumb with mouse", (test) => test
        .step('Mouse click right', async() => {
          const thumb1 = sliderThumb({ index: "0"})
          await thumb1.mouseDown(127)
          await thumb1.mouseUp(127)
        })
        .assertion(sliderThumb({ index: "0"}).has({ ariaValueNow: including('10')}))
        .child("mouse click left", (test) => test
        .step('click mouse', async() => {
          const thumb1 = sliderThumb({ index: "0"})
          await thumb1.mouseDown(200)
          await thumb1.mouseUp(200)
          })
          .assertion(sliderThumb({ index: "0"}).has({ ariaValueNow: including('20')}))
        )
      )
  )