import { Page, test } from 'bigtest';
import { Slider as Component } from '@material-ui/core';
import { Slider, Thumb } from '../src/index';
import { createRenderStep } from './helpers';

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
  .step(Page.visit("/"))
  .child('Slider with one thumb', (test) => test
    .child('default', (test) => test
      .step(renderSlider())
      .assertion(slider.exists())
      .assertion(slider.has({ orientation: 'horizontal' }))
      .assertion(slider.has({ value: 0 }))
      .assertion(slider.has({ textValue: '0°C' }))
      .assertion(slider.has({ minValue: -100 }))
      .assertion(slider.has({ maxValue: 200 }))
      .assertion(slider.is({ horizontal: true }))
      .assertion(slider.is({ vertical: false }))
      .assertion(slider.is({ min: false }))
      .assertion(slider.is({ max: false }))
      .assertion(slider.find(Thumb()).has({ index: 0 }))
      .assertion(slider.find(Thumb()).has({ value: 0 }))
      .assertion(slider.find(Thumb()).has({ textValue: '0°C' }))
      .assertion(slider.find(Thumb('1st')).exists())
      .assertion(slider.find(Thumb({ disabled: false })).exists())
      .assertion(Slider('1st').exists())
      .assertion(Slider({ disabled: false }).exists())
      .assertion(Slider('My Slider').absent())
      .child('decrease', (test) => test
        .step(slider.decrease())
        .assertion(slider.has({ value: -1 }))
        .assertion(slider.has({ textValue: '-1°C' }))
      )
      .child('decrease by 10', (test) => test
        .step(slider.decrease(10))
        .assertion(slider.has({ value: -10 }))
        .assertion(slider.has({ textValue: '-10°C' }))
      )
      .child('decrease by 200', (test) => test
        .step(slider.decrease(200))
        .assertion(slider.has({ value: -100 }))
        .assertion(slider.has({ textValue: '-100°C' }))
        .assertion(slider.is({ min: true }))
      )
      .child('increase', (test) => test
        .step(slider.increase())
        .assertion(slider.has({ value: 1 }))
        .assertion(slider.has({ textValue: '1°C' }))
      )
      .child('increase by 10', (test) => test
        .step(slider.increase(10))
        .assertion(slider.has({ value: 10 }))
        .assertion(slider.has({ textValue: '10°C' }))
      )
      .child('increase by 300', (test) => test
        .step(slider.increase(300))
        .assertion(slider.has({ value: 200 }))
        .assertion(slider.has({ textValue: '200°C' }))
        .assertion(slider.is({ max: true }))
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
      .child('setValue below min', (test) => test
        .step(slider.setValue(-200))
        .assertion(slider.has({ value: -100 }))
      )
      .child('setValue above max', (test) => test
        .step(slider.setValue(300))
        .assertion(slider.has({ value: 200 }))
      )
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
      .step(
        renderSlider({ getAriaLabel: undefined })
      )
      .assertion(slider.find(Thumb('0°C')).exists())
    )
    .child('orientation="vertical"', (test) => test
      .step(renderSlider({ orientation: 'vertical' }))
      .assertion(slider.has({ orientation: 'vertical' }))
      .assertion(slider.is({ horizontal: false }))
      .assertion(slider.is({ vertical: true }))
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
        .assertion(slider.has({ value: -100 }))
        .assertion(slider.is({ min: true }))
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
        .assertion(slider.has({ value: 200 }))
        .assertion(slider.is({ max: true }))
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
        // NOTE: This is expected behavior because the slide's step width is less than 1 px
        .assertion(slider.has({ value: 101 }))
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
        .assertion(slider.has({ value: -100 }))
        .assertion(slider.is({ min: true }))
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
        .assertion(slider.has({ value: 200 }))
        .assertion(slider.is({ max: true }))
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
        // NOTE: This is expected behavior because the slide's step width is less than 1 px
        .assertion(slider.has({ value: 101 }))
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
      .assertion(slider.absent())
      .assertion(disabledSlider.exists())
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
      .assertion(slider.has({ orientation: 'horizontal' }))
      .assertion(slider.has({ value: [-50, 0, 100] }))
      .assertion(slider.has({ textValue: ['-50°C', '0°C', '100°C'] }))
      .assertion(slider.has({ minValue: -100 }))
      .assertion(slider.has({ maxValue: 200 }))
      .assertion(slider.is({ horizontal: true }))
      .assertion(slider.is({ vertical: false }))
      .assertion(slider.is({ min: false }))
      .assertion(slider.is({ max: false }))
      .assertion(firstThumb.has({ index: 0, value: -50, textValue: '-50°C' }))
      .assertion(secondThumb.has({ index: 1, value: 0, textValue: '0°C' }))
      .assertion(thirdThumb.has({ index: 2, value: 100, textValue: '100°C' }))
      .assertion(slider.find(Thumb('nth')).absent())
      .child('decrease 2nd thumb', (test) => test
        .step(secondThumb.decrease())
        .assertion(secondThumb.has({ value: -1 }))
        .assertion(secondThumb.has({ textValue: '-1°C' }))
      )
      .child('decrease 2nd thumb by 10', (test) => test
        .step(secondThumb.decrease(10))
        .assertion(secondThumb.has({ value: -10 }))
        .assertion(secondThumb.has({ textValue: '-10°C' }))
      )
      .child('decrease 2nd thumb by 200', (test) => test
        .step(secondThumb.decrease(200))
        .assertion(slider.has({ value: [-100, -50, 100] }))
        .assertion(secondThumb.has({ value: -50 }))
        .assertion(secondThumb.has({ textValue: '-50°C' }))
        .assertion(secondThumb.is({ min: false }))
        .assertion(firstThumb.has({ value: -100 }))
        .assertion(firstThumb.has({ textValue: '-100°C' }))
        .assertion(firstThumb.is({ min: true }))
      )
      .child('increase 2nd thumb', (test) => test
        .step(secondThumb.increase())
        .assertion(secondThumb.has({ value: 1 }))
        .assertion(secondThumb.has({ textValue: '1°C' }))
      )
      .child('increase 2nd thumb by 10', (test) => test
        .step(secondThumb.increase(10))
        .assertion(secondThumb.has({ value: 10 }))
        .assertion(secondThumb.has({ textValue: '10°C' }))
      )
      .child('increase 2nd thumb by 300', (test) => test
        .step(secondThumb.increase(300))
        .assertion(slider.has({ value: [-50, 100, 200] }))
        .assertion(secondThumb.has({ value: 100 }))
        .assertion(secondThumb.has({ textValue: '100°C' }))
        .assertion(secondThumb.is({ max: false }))
        .assertion(thirdThumb.has({ value: 200 }))
        .assertion(thirdThumb.has({ textValue: '200°C' }))
        .assertion(thirdThumb.is({ max: true }))
      )
      .child('setMin 2nd thumb', (test) => test
        .step(secondThumb.setMin())
        .assertion(slider.is({ min: false }))
        .assertion(secondThumb.is({ min: false }))
        .assertion(firstThumb.is({ min: true }))
        )
      .child('setMin all thumbs', (test) => test
        .step(firstThumb.setMin())
        .step(secondThumb.setMin())
        .step(thirdThumb.setMin())
        .assertion(slider.is({ min: true }))
        .assertion(firstThumb.is({ min: true }))
        .assertion(secondThumb.is({ min: true }))
        .assertion(thirdThumb.is({ min: true }))
      )
      .child('setMax 2nd thumb', (test) => test
        .step(secondThumb.setMax())
        .assertion(slider.is({ max: false }))
        .assertion(secondThumb.is({ max: false }))
        .assertion(thirdThumb.is({ max: true }))
      )
      .child('setMax all thumbs', (test) => test
        .step(thirdThumb.setMax())
        .step(secondThumb.setMax())
        .step(firstThumb.setMax())
        .assertion(slider.is({ max: true }))
        .assertion(firstThumb.is({ max: true }))
        .assertion(secondThumb.is({ max: true }))
        .assertion(thirdThumb.is({ max: true }))
      )
      .child('setValue 2nd thumb', (test) => test
        .step(secondThumb.setValue(50))
        .assertion(secondThumb.has({ value: 50 }))
      )
      .child('setValue 2nd thumb below min', (test) => test
        .step(secondThumb.setValue(-200))
        .assertion(secondThumb.has({ value: -50 }))
        .assertion(firstThumb.has({ value: -100 }))
      )
      .child('setValue 2nd thumb above max', (test) => test
        .step(secondThumb.setValue(300))
        .assertion(secondThumb.has({ value: 100 }))
        .assertion(thirdThumb.has({ value: 200 }))
      )
    )
  );
