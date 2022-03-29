import { Button, including, not, HTML } from "../src";
import { Button as Component } from "@material-ui/core";
import { renderComponent } from "./helpers";
import { ComponentProps } from "react";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "Button",
  component: renderComponent(Component, { children: "My Button" }),
} as ComponentMeta<typeof Component>;

const button = Button(including("My Button".toUpperCase()));

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await button.exists();
    await button.has({ text: "My Button".toUpperCase() });
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-text") });
    await button.has({ className: not(including("MuiButton-textSecondary")) });
    await button.has({ className: not(including("MuiButton-outlined")) });
    await button.has({ className: not(including("MuiButton-contained")) });
  },
};

export const Secondary: ComponentStoryObj<typeof Component> = {
  args: { color: "secondary" },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-text") });
    await button.has({ className: not(including("MuiButton-contained")) });
    await button.has({ className: not(including("MuiButton-textPrimary")) });
  },
};

export const Outlined: ComponentStoryObj<typeof Component> = {
  args: { variant: "outlined" },
  async play() {
    await button.has({ className: including("MuiButton-outlined") });
    await button.has({ className: not(including("MuiButton-text")) });
    await button.has({ className: not(including("MuiButton-contained")) });
  },
};

export const PrimaryOutlined: ComponentStoryObj<typeof Component> = {
  args: { variant: "outlined", color: "primary" },
  async play() {
    await button.has({ className: including("MuiButton-outlined") });
    await button.has({ className: including("MuiButton-outlinedPrimary") });
  },
};

export const SecondaryOutlined: ComponentStoryObj<typeof Component> = {
  args: { variant: "outlined", color: "secondary" },
  async play() {
    await button.has({ className: including("MuiButton-outlined") });
    await button.has({ className: including("MuiButton-outlinedSecondary") });
  },
};

export const InheritOutlined: ComponentStoryObj<typeof Component> = {
  args: { variant: "outlined", color: "inherit" },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-outlined") });
    await button.has({ className: including("MuiButton-colorInherit") });
    await button.has({ className: not(including("MuiButton-text")) });
    await button.has({ className: not(including("MuiButton-textSecondary")) });
    await button.has({ className: not(including("MuiButton-contained")) });
  },
};

export const Contained: ComponentStoryObj<typeof Component> = {
  args: { variant: "contained" },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-contained") });
    await button.has({ className: not(including("MuiButton-textPrimary")) });
    await button.has({ className: not(including("MuiButton-textSecondary")) });
  },
};

export const ContainedPrimary: ComponentStoryObj<typeof Component> = {
  args: { variant: "contained", color: "primary" },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-contained") });
    await button.has({ className: including("MuiButton-containedPrimary") });
    await button.has({ className: not(including("MuiButton-text")) });
    await button.has({ className: not(including("MuiButton-containedSecondary")) });
  },
};

export const ContainedSecondary: ComponentStoryObj<typeof Component> = {
  args: { variant: "contained", color: "secondary" },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-contained") });
    await button.has({ className: including("MuiButton-containedSecondary") });
    await button.has({ className: not(including("MuiButton-text")) });
    await button.has({ className: not(including("MuiButton-containedPrimary")) });
  },
};

export const SmallText: ComponentStoryObj<typeof Component> = {
  args: { size: "small" },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-text") });
    await button.has({ className: including("MuiButton-textSizeSmall") });
    await button.has({ className: not(including("MuiButton-textSizeLarge")) });
    await button.has({ className: not(including("MuiButton-outlinedSizeSmall")) });
    await button.has({ className: not(including("MuiButton-outlinedSizeLarge")) });
    await button.has({ className: not(including("MuiButton-containedSizeSmall")) });
    await button.has({ className: not(including("MuiButton-containedSizeLarge")) });
  },
};

export const LargeText: ComponentStoryObj<typeof Component> = {
  args: { size: "large" },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-text") });
    await button.has({ className: including("MuiButton-textSizeLarge") });
    await button.has({ className: not(including("MuiButton-textSizeSmall")) });
    await button.has({ className: not(including("MuiButton-outlinedSizeSmall")) });
    await button.has({ className: not(including("MuiButton-outlinedSizeLarge")) });
    await button.has({ className: not(including("MuiButton-containedSizeSmall")) });
    await button.has({ className: not(including("MuiButton-containedSizeLarge")) });
  },
};

export const SmallOutlined: ComponentStoryObj<typeof Component> = {
  args: { variant: "outlined", size: "small" },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-outlined") });
    await button.has({ className: including("MuiButton-outlinedSizeSmall") });
    await button.has({ className: not(including("MuiButton-textSizeSmall")) });
    await button.has({ className: not(including("MuiButton-outlinedSizeLarge")) });
    await button.has({ className: not(including("MuiButton-containedSizeSmall")) });
    await button.has({ className: not(including("MuiButton-containedSizeLarge")) });
  },
};

export const LargeOutlined: ComponentStoryObj<typeof Component> = {
  args: { variant: "outlined", size: "large" },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-outlined") });
    await button.has({ className: including("MuiButton-outlinedSizeLarge") });
    await button.has({ className: not(including("MuiButton-textSizeSmall")) });
    await button.has({ className: not(including("MuiButton-textSizeLarge")) });
    await button.has({ className: not(including("MuiButton-outlinedSizeSmall")) });
    await button.has({ className: not(including("MuiButton-containedSizeLarge")) });
    await button.has({ className: not(including("MuiButton-containedSizeSmall")) });
  },
};

export const SmallContained: ComponentStoryObj<typeof Component> = {
  args: { variant: "contained", size: "small" },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-contained") });
    await button.has({ className: including("MuiButton-containedSizeSmall") });
    await button.has({ className: not(including("MuiButton-textSizeSmall")) });
    await button.has({ className: not(including("MuiButton-textSizeLarge")) });
    await button.has({ className: not(including("MuiButton-outlinedSizeSmall")) });
    await button.has({ className: not(including("MuiButton-outlinedSizeLarge")) });
    await button.has({ className: not(including("MuiButton-containedSizeLarge")) });
  },
};

export const LargeContained: ComponentStoryObj<typeof Component> = {
  args: { variant: "contained", size: "large" },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-contained") });
    await button.has({ className: including("MuiButton-containedSizeLarge") });
    await button.has({ className: not(including("MuiButton-textSizeSmall")) });
    await button.has({ className: not(including("MuiButton-textSizeLarge")) });
    await button.has({ className: not(including("MuiButton-outlinedSizeSmall")) });
    await button.has({ className: not(including("MuiButton-outlinedSizeLarge")) });
    await button.has({ className: not(including("MuiButton-containedSizeSmall")) });
  },
};

export const StartIcon: ComponentStoryObj<typeof Component> = {
  args: { startIcon: <span>icon</span> },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-text") });
    await button.find(HTML({ className: including("MuiButton-startIcon") })).exists();
    await button.find(HTML({ className: not(including("MuiButton-endIcon")) })).exists();
  },
};

export const EndIcon: ComponentStoryObj<typeof Component> = {
  args: { endIcon: <span>icon</span> },
  async play() {
    await button.has({ className: including("MuiButton-root") });
    await button.has({ className: including("MuiButton-text") });
    await button.find(HTML({ className: including("MuiButton-endIcon") })).exists();
    await button.find(HTML({ className: not(including("MuiButton-startIcon")) })).exists();
  },
};

export const Ripple: ComponentStoryObj<typeof Component> = {
  args: { TouchRippleProps: { className: "touch-ripple" } },
  async play() {
    await button.find(HTML({ className: including("touch-ripple") })).exists();
  },
};

export const DisableRipple: ComponentStoryObj<typeof Component> = {
  args: { disableRipple: true, TouchRippleProps: { className: "touch-ripple" } },
  async play() {
    await button.find(HTML({ className: including("touch-ripple") })).absent();
  },
};

export const DisableElevation: ComponentStoryObj<typeof Component> = {
  args: { disableElevation: true },
  async play() {
    await button.has({ className: including("MuiButton-disableElevation") });
  },
};

export const FocusRipple: ComponentStoryObj<typeof Component> = {
  args: { TouchRippleProps: { classes: { ripplePulsate: "pulstat-focus-visible" } } },
  async play() {
    await button.focus();
    await button.find(HTML({ className: including("pulstat-focus-visible") })).exists();
  },
};

export const DisableFocusRipple: ComponentStoryObj<typeof Component> = {
  args: {
    disableFocusRipple: true,
    TouchRippleProps: { classes: { ripplePulsate: "pulstat-focus-visible" } },
  },
  async play() {
    await button.focus();
    await button.find(HTML({ className: including("MuiTouchRipple-rippleVisible") })).absent();
  },
};

export const Anchor: ComponentStoryObj<typeof Component> = {
  args: { href: "https://google.com" },
  async play() {
    await button.has({
      className: including("MuiButton-root"),
      href: including("https://google.com"),
    });
  },
};

export const ForwardClasses: ComponentStoryObj<typeof Component> = {
  args: { disabled: true, classes: { disabled: "disabledClassName" } },
  async play() {
    await Button({ disabled: true }).has({ className: including("disabledClassName"), disabled: true });
  },
};

export const Span: ComponentStoryObj<typeof Component> = {
  args: { component: "span" } as ComponentProps<typeof Component>,
  async play() {
    await button.exists();
    await HTML.selector("span")({ className: including("MuiButton-root") }).exists();
  },
};
