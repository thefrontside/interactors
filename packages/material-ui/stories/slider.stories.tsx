import { Slider as Component } from "@material-ui/core";
import { Slider, Thumb } from "../src";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { ComponentProps } from "react";

export default {
  title: "Slider",
  component: renderComponent(
    Component,
    {
      min: -100,
      max: 200,
      defaultValue: 0,
      getAriaLabel: (index) => (index == 0 ? "1st" : index == 1 ? "2nd" : index == 2 ? "3rd" : "nth"),
      getAriaValueText: (value) => `${value}°C`,
    },
    ({ props, children }) => (
      <div style={{ width: "100px", height: "100px" }}>
        <span id="label-id">Slider Label</span>
        {children(props)}
      </div>
    )
  ),
} as ComponentMeta<typeof Component>;

const slider = Slider();
const firstThumb = slider.find(Thumb("1st"));
const secondThumb = slider.find(Thumb("2nd"));
const thirdThumb = slider.find(Thumb("3rd"));
const disabledSlider = Slider({ disabled: true });
const disabledThumb = Thumb({ disabled: true });

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await slider.exists(), await slider.has({ orientation: "horizontal" });
    await slider.has({ value: 0 });
    await slider.has({ textValue: "0°C" });
    await slider.has({ minValue: -100 });
    await slider.has({ maxValue: 200 });
    await slider.is({ horizontal: true });
    await slider.is({ vertical: false });
    await slider.is({ min: false });
    await slider.is({ max: false });
    await slider.find(Thumb()).has({ index: 0 });
    await slider.find(Thumb()).has({ value: 0 });
    await slider.find(Thumb()).has({ textValue: "0°C" });
    await slider.find(Thumb("1st")).exists();
    await slider.find(Thumb({ disabled: false })).exists();
    await Slider("1st").exists();
    await Slider({ disabled: false }).exists();
    await Slider("My Slider").absent();
  },
};

export const DecreaseAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await slider.decrease();
    await slider.has({ value: -1 });
    await slider.has({ textValue: "-1°C" });
  },
};

export const DecreaseActionBy10: ComponentStoryObj<typeof Component> = {
  async play() {
    await slider.decrease(10);

    await slider.has({ value: -10 });
    await slider.has({ textValue: "-10°C" });
  },
};

export const DecreaseActionBy200: ComponentStoryObj<typeof Component> = {
  async play() {
    await slider.decrease(200);

    await slider.has({ value: -100 });
    await slider.has({ textValue: "-100°C" });
    await slider.is({ min: true });
  },
};

export const IncreaseAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await slider.increase();
    await slider.has({ value: 1 });
    await slider.has({ textValue: "1°C" });
  },
};

export const IncreaseActionBy10: ComponentStoryObj<typeof Component> = {
  async play() {
    await slider.increase(10);

    await slider.has({ value: 10 });
    await slider.has({ textValue: "10°C" });
  },
};

export const IncreaseActionBy300: ComponentStoryObj<typeof Component> = {
  async play() {
    await slider.increase(300);
    await slider.has({ value: 200 });
    await slider.has({ textValue: "200°C" });
    await slider.is({ max: true });
  },
};

export const SetMinAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await slider.setMin();
    await slider.is({ min: true });
  },
};

export const SetMaxAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await slider.setMax();
    await slider.is({ max: true });
  },
};

export const SetValueAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await slider.setValue(100);
    // NOTE: This is expected behavior because the slide's step width is less than 1 px
    await slider.has({ value: 101 });
  },
};

export const SetValueActionBelowMin: ComponentStoryObj<typeof Component> = {
  async play() {
    await slider.setValue(-200);
    await slider.has({ value: -100 });
  },
};

export const SetValueActionAboveMax: ComponentStoryObj<typeof Component> = {
  async play() {
    await slider.setValue(300);
    await slider.has({ value: 200 });
  },
};

export const WithAriaLabel: ComponentStoryObj<typeof Component> = {
  args: { "aria-label": "My Slider", getAriaLabel: undefined },
  async play() {
    await Slider("My Slider").exists();
  },
};

export const WithAriaLabeledBy: ComponentStoryObj<typeof Component> = {
  args: { "aria-labelledby": "label-id" },
  async play() {
    await Slider("Slider Label").exists();
  },
};

export const WithoutGetAriaLabel: ComponentStoryObj<typeof Component> = {
  args: { getAriaLabel: undefined },
  async play() {
    await slider.find(Thumb("0°C")).exists();
  },
};

export const OrientationVertical: ComponentStoryObj<typeof Component> = {
  args: { orientation: "vertical" },
  async play() {
    await slider.has({ orientation: "vertical" });
    await slider.is({ horizontal: false });
    await slider.is({ vertical: true });
  },
};

export const DecreaseActionVertical: ComponentStoryObj<typeof Component> = {
  args: { orientation: "vertical" },
  async play() {
    await slider.decrease();
    await slider.has({ value: -1 });
  },
};

export const DecreaseActionBy10Vertical: ComponentStoryObj<typeof Component> = {
  args: { orientation: "vertical" },
  async play() {
    await slider.decrease(10);
    await slider.has({ value: -10 });
  },
};

export const DecreaseActionBy200Vertical: ComponentStoryObj<typeof Component> = {
  args: { orientation: "vertical" },
  async play() {
    await slider.decrease(200);
    await slider.has({ value: -100 });
    await slider.is({ min: true });
  },
};

export const IncreaseActionVertical: ComponentStoryObj<typeof Component> = {
  args: { orientation: "vertical" },
  async play() {
    await slider.increase();
    await slider.has({ value: 1 });
  },
};

export const IncreaseActionBy10Vertical: ComponentStoryObj<typeof Component> = {
  args: { orientation: "vertical" },
  async play() {
    await slider.increase(10);
    await slider.has({ value: 10 });
  },
};

export const IncreaseActionBy300Vertical: ComponentStoryObj<typeof Component> = {
  args: { orientation: "vertical" },
  async play() {
    await slider.increase(300);
    await slider.has({ value: 200 });
    await slider.is({ max: true });
  },
};

export const SetMinActionVertical: ComponentStoryObj<typeof Component> = {
  args: { orientation: "vertical" },
  async play() {
    await slider.setMin();
    await slider.is({ min: true });
  },
};

export const SetMaxActionVertical: ComponentStoryObj<typeof Component> = {
  args: { orientation: "vertical" },
  async play() {
    await slider.setMax();
    await slider.is({ max: true });
  },
};

export const SetValueActionVertical: ComponentStoryObj<typeof Component> = {
  args: { orientation: "vertical" },
  async play() {
    await slider.setValue(100);
    // NOTE: This is expected behavior because the slide's step width is less than 1 px
    await slider.has({ value: 101 });
  },
};

export const SetValueActionBelowMinVertical: ComponentStoryObj<typeof Component> = {
  args: { orientation: "vertical" },
  async play() {
    await slider.setValue(-200);
    await slider.has({ value: -100 });
  },
};

export const SetValueActionAboveMaxVertical: ComponentStoryObj<typeof Component> = {
  args: { orientation: "vertical" },
  async play() {
    await slider.setValue(300);
    await slider.has({ value: 200 });
  },
};

const sliderMarkProps: ComponentProps<typeof Component> = {
  step: null,
  marks: [-100, -75, -50, -25, -10, 0, 25, 50, 100, 150, 200].map((value) => ({ value, label: `${value}°C` })),
};

export const DecreaseActionWithMarks: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.decrease();
    await slider.has({ value: -10 });
  },
};

export const DecreaseActionBy3WithMarks: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.decrease(3);
    await slider.has({ value: -50 });
  },
};

export const DecreaseActionBy10WithMarks: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.decrease(10);

    await slider.has({ value: -100 });
    await slider.is({ min: true });
  },
};

export const IncreaseActionWithMarks: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.increase();
    await slider.has({ value: 25 });
  },
};

export const IncreaseActionBy3WithMarks: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.increase(3);
    await slider.has({ value: 100 });
  },
};

export const IncreaseActionBy10WithMarks: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.increase(10);
    await slider.has({ value: 200 });
    await slider.is({ max: true });
  },
};

export const SetMinActionWithMarks: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.setMin();
    await slider.is({ min: true });
  },
};

export const SetMaxActionWithMarks: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.setMax();
    await slider.is({ max: true });
  },
};

export const SetValueActionWithMarks: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.setValue(100);
    await slider.has({ value: 100 });
  },
};

export const SetValueActionBelowMark: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.setValue(90);
    await slider.has({ value: 100 });
  },
};

export const SetValueActionAboveMark: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.setValue(110);
    await slider.has({ value: 100 });
  },
};

export const SetValueActionBelowMinWithMarks: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.setValue(-200);
    await slider.has({ value: -100 });
  },
};

export const SetValueActionAboveMarkWithMarks: ComponentStoryObj<typeof Component> = {
  args: sliderMarkProps,
  async play() {
    await slider.setValue(300);
    await slider.has({ value: 200 });
  },
};

export const Disabled: ComponentStoryObj<typeof Component> = {
  args: { disabled: true },
  async play() {
    await slider.absent(), await disabledSlider.exists();
  },
};

export const DecreaseActionDisabled: ComponentStoryObj<typeof Component> = {
  args: { disabled: true },
  async play() {
    await disabledThumb.decrease();
    await Slider({ disabled: true, value: 0 }).exists();
  },
};

export const IncreaseActionDisabled: ComponentStoryObj<typeof Component> = {
  args: { disabled: true },
  async play() {
    await disabledThumb.increase();
    await Slider({ disabled: true, value: 0 }).exists();
  },
};

export const SetMinActionDisabled: ComponentStoryObj<typeof Component> = {
  args: { disabled: true },
  async play() {
    await disabledThumb.setMin();
    await Slider({ disabled: true, min: false }).exists();
  },
};

export const SetMaxActionDisabled: ComponentStoryObj<typeof Component> = {
  args: { disabled: true },
  async play() {
    await disabledThumb.setMax();
    await Slider({ disabled: true, max: false }).exists();
  },
};

export const SetValueActionDisabled: ComponentStoryObj<typeof Component> = {
  args: { disabled: true },
  async play() {
    await disabledThumb.setValue(100);
    await Slider({ disabled: true, value: 0 }).exists();
  },
};

const thumbProps: ComponentProps<typeof Component> = { defaultValue: [-50, 0, 100] };

export const MultipleThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await slider.has({ orientation: "horizontal" });
    await slider.has({ value: [-50, 0, 100] });
    await slider.has({ textValue: ["-50°C", "0°C", "100°C"] });
    await slider.has({ minValue: -100 });
    await slider.has({ maxValue: 200 });
    await slider.is({ horizontal: true });
    await slider.is({ vertical: false });
    await slider.is({ min: false });
    await slider.is({ max: false });
    await firstThumb.has({ index: 0, value: -50, textValue: "-50°C" });
    await secondThumb.has({ index: 1, value: 0, textValue: "0°C" });
    await thirdThumb.has({ index: 2, value: 100, textValue: "100°C" });
    await slider.find(Thumb("nth")).absent();
  },
};

export const DecreaseActionMultipleThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await secondThumb.decrease();
    await secondThumb.has({ value: -1 });
    await secondThumb.has({ textValue: "-1°C" });
  },
};

export const DecreaseActionBy10MultipleThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await secondThumb.decrease(10);
    await secondThumb.has({ value: -10 });
    await secondThumb.has({ textValue: "-10°C" });
  },
};

export const DecreaseActionBy200MultipleThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await secondThumb.decrease(200);
    await slider.has({ value: [-100, -50, 100] });
    await secondThumb.has({ value: -50 });
    await secondThumb.has({ textValue: "-50°C" });
    await secondThumb.is({ min: false });
    await firstThumb.has({ value: -100 });
    await firstThumb.has({ textValue: "-100°C" });
    await firstThumb.is({ min: true });
  },
};

export const IncreaseActionMultipleThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await secondThumb.increase();
    await secondThumb.has({ value: 1 });
    await secondThumb.has({ textValue: "1°C" });
  },
};

export const IncreaseActionBy10MultipleThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await secondThumb.increase(10);
    await secondThumb.has({ value: 10 });
    await secondThumb.has({ textValue: "10°C" });
  },
};

export const IncreaseActionBy300MultipleThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await secondThumb.increase(300);
    await slider.has({ value: [-50, 100, 200] });
    await secondThumb.has({ value: 100 });
    await secondThumb.has({ textValue: "100°C" });
    await secondThumb.is({ max: false });
    await thirdThumb.has({ value: 200 });
    await thirdThumb.has({ textValue: "200°C" });
    await thirdThumb.is({ max: true });
  },
};

export const SetMinActionMultipleThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await secondThumb.setMin();
    await slider.is({ min: false });
    await secondThumb.is({ min: false });
    await firstThumb.is({ min: true });
  },
};

export const SetMinActionAllThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await firstThumb.setMin();
    await secondThumb.setMin();
    await thirdThumb.setMin();

    await slider.is({ min: true });
    await firstThumb.is({ min: true });
    await secondThumb.is({ min: true });
    await thirdThumb.is({ min: true });
  },
};

export const SetMaxActionMultipleThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await secondThumb.setMax();
    await slider.is({ max: false });
    await secondThumb.is({ max: false });
    await thirdThumb.is({ max: true });
  },
};

export const SetMaxActionAllThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await thirdThumb.setMax();
    await secondThumb.setMax();
    await firstThumb.setMax();
    await slider.is({ max: true });
    await firstThumb.is({ max: true });
    await secondThumb.is({ max: true });
    await thirdThumb.is({ max: true });
  },
};

export const SetValueActionMultipleThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await secondThumb.setValue(50);
    await secondThumb.has({ value: 50 });
  },
};

export const SetValueActionBelowMinMultipleThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await secondThumb.setValue(-200);
    await secondThumb.has({ value: -50 });
    await firstThumb.has({ value: -100 });
  },
};

export const SetValueActionAboveMaxMultipleThumbs: ComponentStoryObj<typeof Component> = {
  args: thumbProps,
  async play() {
    await secondThumb.setValue(300);
    await secondThumb.has({ value: 100 });
    await thirdThumb.has({ value: 200 });
  },
};
