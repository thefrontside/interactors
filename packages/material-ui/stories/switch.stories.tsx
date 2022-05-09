import { Body } from "../src/body";
import { matching, some, Switch } from "../src";
import { Switch as Component, FormControlLabel } from "@material-ui/core";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "Switch",
  component: renderComponent(Component, {}, ({ props, children }) => (
    <FormControlLabel label="switch" control={children(props)} />
  )),
} as ComponentMeta<typeof Component>;

const switcher = Switch("switch");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await switcher.exists();
    await switcher.is({ checked: false });
    await switcher.is({ focused: false });
    await switcher.has({ classList: some(matching(/MuiSwitch-input(-\d+)?/)) });
    await Switch({ disabled: false }).exists();
  },
};

export const ClickAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await switcher.click();
    await switcher.is({ checked: true, focused: true });
  },
};

export const FocusAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await switcher.focus();
    await switcher.is({ focused: true });
  },
};

export const CheckAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await switcher.check();
    await switcher.is({ checked: true });
  },
};

export const ToggleAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await switcher.toggle();
    await switcher.is({ checked: true });
    await switcher.toggle();
    await switcher.is({ checked: false });
  },
};

export const Checked: ComponentStoryObj<typeof Component> = {
  render: () => <FormControlLabel label="switch" checked control={<Component />} />,
  async play() {
    await switcher.is({ checked: true });
  },
};

export const Disabled: ComponentStoryObj<typeof Component> = {
  render: () => <FormControlLabel label="switch" disabled control={<Component />} />,
  async play() {
    await Switch({ disabled: true }).exists();
  },
};

export const Visible: ComponentStoryObj<typeof Component> = {
  render: () => <Component style={{ visibility: "hidden" }} />,
  async play() {
    await Switch({ visible: false }).exists();
  },
};

export const UncheckAction: ComponentStoryObj<typeof Component> = {
  args: { defaultChecked: true },
  async play() {
    await switcher.uncheck();
    await switcher.is({ checked: false });
  },
};

export const AutoFocus: ComponentStoryObj<typeof Component> = {
  args: { autoFocus: true },
  async play() {
    await switcher.is({ focused: true });
  },
};

export const BlurActionAutoFocus: ComponentStoryObj<typeof Component> = {
  args: { autoFocus: true },
  async play() {
    await switcher.blur();
    await switcher.is({ focused: false });
  },
};

export const BodyClickAutoFocus: ComponentStoryObj<typeof Component> = {
  args: { autoFocus: true },
  async play() {
    await Body().click();
    await switcher.is({ focused: false });
  },
};
