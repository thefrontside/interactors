import { Page, test } from 'bigtest';
import { Slider as Interactor, including } from '../src/index';
import { Slider as MuiSlider, Typography } from '@material-ui/core'
import { render } from './helpers';

const slider = Interactor;

export default test("slider")
  .step(Page.visit("/"))
  // .child("render Slider", (test) => test
  //   .step("render Slider", async() => {
  //     await render(<MuiSlider defaultValue={[20, 30]}/>)

  //     const slider1 = slider({ index: 1 })
  //     const slider2 = slider({ index: 2 });


  //     console.log('these are the sliders', slider1, slider2);
  //   })
  //   .assertion("we have a slider", async() => {
  //     console.log('this is the slider returned', slider);
  //     slider().exists()
  //   })
  //   .assertion(slider({ index: 1}).exists())
  // )
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
        <div style={{ width: '80%', padding: '1em'}}>
          <Typography id="discrete-slider-always" gutterBottom>
            Always visible
          </Typography>
          <MuiSlider
            defaultValue={[80, 20]}
            // getAriaValueText={valuetext}
            // aria-labelledby="discrete-slider-always"
            step={10}
            marks={marks}
            // valueLabelDisplay="on"
          />
        </div>)
      })
      .child("can control slider thumb with keyboard", (test) => test
        .step('key thumb right', async() => {
          const thumb1 = slider({ dataIndex: "0"})
          await thumb1.keyThumb("ArrowRight");
        })
        .assertion(slider({ dataIndex: "0"}).has({ ariaValueNow: including('30')}))
        .child("key thumb left", (test) => test
          .step('key thumb left', async() => {
            const thumb1 = slider({ dataIndex: "0"})
            await thumb1.keyThumb("ArrowLeft");
          })
          .assertion(slider({ dataIndex: "0"}).has({ ariaValueNow: including('20')}))
        )
      )
  )