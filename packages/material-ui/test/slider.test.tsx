import { test, visit } from "bigtest";
import { Slider as Component } from "@material-ui/core";
import { Slider, Thumb } from "../src/index";
import { createRenderStep } from "./helpers";

const renderSlider = createRenderStep(
  Component,
  {
    min: -100,
    max: 200,
    defaultValue: 0,
    getAriaLabel: index =>
      index == 0 ? '1st' :
      index == 1 ? '2nd' :
      index == 2 ? '3rd' :
      'nth',
    getAriaValueText: value => `${value}°C`
  },
  ({ props, children }) => (
    <div style={{ width: '100px', height: '100px' }}>
      <span id="label-id">Slider Label</span>
      {children(props)}
    </div>
  )
);
const slider = Slider();
const firstThumb = slider.find(Thumb('1st'));
const secondThumb = slider.find(Thumb('2nd'));
const thirdThumb = slider.find(Thumb('3rd'));
const disabledSlider = Slider({ disabled: true });
const disabledThumb = Thumb({ disabled: true });

export default test("Slider")
  .step(visit("/"))
  .child('Slider with one thumb', (test) => test
    .child('default', (test) => test
      .step(renderSlider())
      .assertion(
        slider.exists(),
        slider.has({ orientation: 'horizontal' }),
        slider.has({ value: 0 }),
        slider.has({ textValue: '0°C' }),
        slider.has({ minValue: -100 }),
        slider.has({ maxValue: 200 }),
        slider.is({ horizontal: true }),
        slider.is({ vertical: false }),
        slider.is({ min: false }),
        slider.is({ max: false }),
        slider.find(Thumb()).has({ index: 0 }),
        slider.find(Thumb()).has({ value: 0 }),
        slider.find(Thumb()).has({ textValue: '0°C' }),
        slider.find(Thumb('1st')).exists(),
        slider.find(Thumb({ disabled: false })).exists(),
        Slider('1st').exists(),
        Slider({ disabled: false }).exists(),
        Slider('My Slider').absent()
      )
      .child('decrease', (test) => test
        .step(slider.decrease())
        .assertion(
          slider.has({ value: -1 }),
          slider.has({ textValue: '-1°C' })
        )
      )
      .child('decrease by 10', (test) => test
        .step(slider.decrease(10))
        .assertion(
          slider.has({ value: -10 }),
          slider.has({ textValue: '-10°C' })
        )
      )
      .child('decrease by 200', (test) => test
        .step(slider.decrease(200))
        .assertion(
          slider.has({ value: -100 }),
          slider.has({ textValue: '-100°C' }),
          slider.is({ min: true })
        )
      )
      .child('increase', (test) => test
        .step(slider.increase())
        .assertion(
          slider.has({ value: 1 }),
          slider.has({ textValue: '1°C' })
        )
      )
      .child('increase by 10', (test) => test
        .step(slider.increase(10))
        .assertion(
          slider.has({ value: 10 }),
          slider.has({ textValue: '10°C' })
        )
      )
      .child('increase by 300', (test) => test
        .step(slider.increase(300))
        .assertion(
          slider.has({ value: 200 }),
          slider.has({ textValue: '200°C' }),
          slider.is({ max: true })
        )
      )
      .child('setMin', (test) => test
        .step(slider.setMin())
        .assertion(slider.is({ min: true }))
      )
      .child('setMax', (test) => test
        .step(slider.setMax())
        .assertion(slider.is({ max: true }))
      )
      // .child('setValue', (test) => test
      //   .step(slider.setValue(100))
      //   // NOTE: This is expected behavior because the slide's step width is less than 1 px
      //   .assertion(slider.has({ value: 101 }))
      // )
      .child('setValue below min', (test) => test
        .step(slider.setValue(-200))
        .assertion(slider.has({ value: -100 }))
      )
      // .child('setValue above max', (test) => test
      //   .step(slider.setValue(300))
      //   .assertion(slider.has({ value: 200 }))
      // )
    )
    .child('aria-label="My Slider"', (test) => test
      .step(renderSlider({ "aria-label": 'My Slider', getAriaLabel: undefined }))
      .assertion(Slider('My Slider').exists())
    )
    .child('aria-labelledby="label-id"', (test) => test
      .step(renderSlider({ "aria-labelledby": 'label-id' }))
      .assertion(Slider('Slider Label').exists())
    )
    .child('without getAriaLabel', (test) => test
      .step(renderSlider({ getAriaLabel: undefined }))
      .assertion(slider.find(Thumb('0°C')).exists())
    )
    .child('orientation="vertical"', (test) => test
      .step(renderSlider({ orientation: 'vertical' }))
      .assertion(
        slider.has({ orientation: 'vertical' }),
        slider.is({ horizontal: false }),
        slider.is({ vertical: true })
      )
      .child('decrease', (test) => test
        .step(slider.decrease())
        .assertion(slider.has({ value: -1 }))
      )
      .child('decrease by 10', (test) => test
        .step(slider.decrease(10))
        .assertion(slider.has({ value: -10 }))
      )
      .child('decrease by 200', (test) => test
        .step(slider.decrease(200))
        .assertion(
          slider.has({ value: -100 }),
          slider.is({ min: true })
        )
      )
      .child('increase', (test) => test
        .step(slider.increase())
        .assertion(slider.has({ value: 1 }))
      )
      .child('increase by 10', (test) => test
        .step(slider.increase(10))
        .assertion(slider.has({ value: 10 }))
      )
      .child('increase by 300', (test) => test
        .step(slider.increase(300))
        .assertion(
          slider.has({ value: 200 }),
          slider.is({ max: true })
        )
      )
      .child('setMin', (test) => test
        .step(slider.setMin())
        .assertion(slider.is({ min: true }))
      )
      .child('setMax', (test) => test
        .step(slider.setMax())
        .assertion(slider.is({ max: true }))
      )
      // .child('setValue', (test) => test
      //   .step(slider.setValue(100))
      //   .assertion(slider.has({ value: 100 }))
      // )
      .child('setValue below min', (test) => test
        .step(slider.setValue(-200))
        .assertion(slider.has({ value: -100 }))
      )
      // .child('setValue above max', (test) => test
      //   .step(slider.setValue(300))
      //   // NOTE: This is expected behavior because the slide's step width is less than 1 px
      //   .assertion(slider.has({ value: 199 }))
      // )
    )
    .child('with marks', (test) => test
      .step(
        renderSlider({
          step: null,
          marks: [-100, -75, -50, -25, -10, 0, 25, 50, 100, 150, 200]
            .map(value => ({ value, label: `${value}°C` }))
        })
      )
      .child('decrease', (test) => test
        .step(slider.decrease())
        .assertion(slider.has({ value: -10 }))
      )
      .child('decrease by 3', (test) => test
        .step(slider.decrease(3))
        .assertion(slider.has({ value: -50 }))
      )
      .child('decrease by 10', (test) => test
        .step(slider.decrease(10))
        .assertion(
          slider.has({ value: -100 }),
          slider.is({ min: true })
        )
      )
      .child('increase', (test) => test
        .step(slider.increase())
        .assertion(slider.has({ value: 25 }))
      )
      .child('increase by 3', (test) => test
        .step(slider.increase(3))
        .assertion(slider.has({ value: 100 }))
      )
      .child('increase by 10', (test) => test
        .step(slider.increase(10))
        .assertion(
          slider.has({ value: 200 }),
          slider.is({ max: true })
        )
      )
      .child('setMin', (test) => test
        .step(slider.setMin())
        .assertion(slider.is({ min: true }))
      )
      .child('setMax', (test) => test
        .step(slider.setMax())
        .assertion(slider.is({ max: true }))
      )
      .child('setValue', (test) => test
        .step(slider.setValue(100))
        .assertion(slider.has({ value: 100 }))
      )
      .child('setValue a little below the mark', (test) => test
        .step(slider.setValue(90))
        .assertion(slider.has({ value: 100 }))
      )
      .child('setValue a little above the mark', (test) => test
        .step(slider.setValue(110))
        .assertion(slider.has({ value: 100 }))
      )
      .child('setValue below min', (test) => test
        .step(slider.setValue(-200))
        .assertion(slider.has({ value: -100 }))
      )
      .child('setValue above max', (test) => test
        .step(slider.setValue(300))
        .assertion(slider.has({ value: 200 }))
      )
    )
    .child('disabled={true}', (test) => test
      .step(renderSlider({ disabled: true }))
      .assertion(
        slider.absent(),
        disabledSlider.exists()
      )
      .child('decrease', (test) => test
        .step(disabledThumb.decrease())
        .assertion(Slider({ disabled: true, value: 0 }).exists())
      )
      .child('increase', (test) => test
        .step(disabledThumb.increase())
        .assertion(Slider({ disabled: true, value: 0 }).exists())
      )
      .child('setMin', (test) => test
        .step(disabledThumb.setMin())
        .assertion(Slider({ disabled: true, min: false }).exists())
      )
      .child('setMax', (test) => test
        .step(disabledThumb.setMax())
        .assertion(Slider({ disabled: true, max: false }).exists())
      )
      .child('setValue', (test) => test
        .step(disabledThumb.setValue(100))
        .assertion(Slider({ disabled: true, value: 0 }).exists())
      )
    )
  )
  .child('Slider with multiple thumbs', (test) => test
    .child('default', (test) => test
      .step(renderSlider({ defaultValue: [-50, 0, 100] }))
      .assertion(
        slider.has({ orientation: 'horizontal' }),
        slider.has({ value: [-50, 0, 100] }),
        slider.has({ textValue: ['-50°C', '0°C', '100°C'] }),
        slider.has({ minValue: -100 }),
        slider.has({ maxValue: 200 }),
        slider.is({ horizontal: true }),
        slider.is({ vertical: false }),
        slider.is({ min: false }),
        slider.is({ max: false }),
        firstThumb.has({ index: 0, value: -50, textValue: '-50°C' }),
        secondThumb.has({ index: 1, value: 0, textValue: '0°C' }),
        thirdThumb.has({ index: 2, value: 100, textValue: '100°C' }),
        slider.find(Thumb('nth')).absent()
      )
      .child('decrease 2nd thumb', (test) => test
        .step(secondThumb.decrease())
        .assertion(
          secondThumb.has({ value: -1 }),
          secondThumb.has({ textValue: '-1°C' })
        )
      )
      .child('decrease 2nd thumb by 10', (test) => test
        .step(secondThumb.decrease(10))
        .assertion(
          secondThumb.has({ value: -10 }),
          secondThumb.has({ textValue: '-10°C' })
        )
      )
      .child('decrease 2nd thumb by 200', (test) => test
        .step(secondThumb.decrease(200))
        .assertion(
          slider.has({ value: [-100, -50, 100] }),
          secondThumb.has({ value: -50 }),
          secondThumb.has({ textValue: '-50°C' }),
          secondThumb.is({ min: false }),
          firstThumb.has({ value: -100 }),
          firstThumb.has({ textValue: '-100°C' }),
          firstThumb.is({ min: true })
        )
      )
      .child('increase 2nd thumb', (test) => test
        .step(secondThumb.increase())
        .assertion(
          secondThumb.has({ value: 1 }),
          secondThumb.has({ textValue: '1°C' })
        )
      )
      .child('increase 2nd thumb by 10', (test) => test
        .step(secondThumb.increase(10))
        .assertion(
          secondThumb.has({ value: 10 }),
          secondThumb.has({ textValue: '10°C' })
        )
      )
      .child('increase 2nd thumb by 300', (test) => test
        .step(secondThumb.increase(300))
        .assertion(
          slider.has({ value: [-50, 100, 200] }),
          secondThumb.has({ value: 100 }),
          secondThumb.has({ textValue: '100°C' }),
          secondThumb.is({ max: false }),
          thirdThumb.has({ value: 200 }),
          thirdThumb.has({ textValue: '200°C' }),
          thirdThumb.is({ max: true })
        )
      )
      .child('setMin 2nd thumb', (test) => test
        .step(secondThumb.setMin())
        .assertion(
          slider.is({ min: false }),
          secondThumb.is({ min: false }),
          firstThumb.is({ min: true })
        )
      )
      .child('setMin all thumbs', (test) => test
        .step(
          firstThumb.setMin(),
          secondThumb.setMin(),
          thirdThumb.setMin()
        )
        .assertion(
          slider.is({ min: true }),
          firstThumb.is({ min: true }),
          secondThumb.is({ min: true }),
          thirdThumb.is({ min: true })
        )
      )
      .child('setMax 2nd thumb', (test) => test
        .step(secondThumb.setMax())
        .assertion(
          slider.is({ max: false }),
          secondThumb.is({ max: false }),
          thirdThumb.is({ max: true })
        )
      )
      .child('setMax all thumbs', (test) => test
        .step(
          thirdThumb.setMax(),
          secondThumb.setMax(),
          firstThumb.setMax()
        )
        .assertion(
          slider.is({ max: true }),
          firstThumb.is({ max: true }),
          secondThumb.is({ max: true }),
          thirdThumb.is({ max: true })
        )
      )
      .child('setValue 2nd thumb', (test) => test
        .step(secondThumb.setValue(50))
        .assertion(secondThumb.has({ value: 50 }))
      )
      .child('setValue 2nd thumb below min', (test) => test
        .step(secondThumb.setValue(-200))
        .assertion(
          secondThumb.has({ value: -50 }),
          firstThumb.has({ value: -100 })
        )
      )
      .child('setValue 2nd thumb above max', (test) => test
        .step(secondThumb.setValue(300))
        .assertion(
          secondThumb.has({ value: 100 }),
          thirdThumb.has({ value: 200 })
        )
      )
    )
  );
