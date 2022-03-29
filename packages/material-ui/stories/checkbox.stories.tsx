import { Body } from "../src/body";
import { Checkbox } from "../src";
import { Checkbox as Component, FormControlLabel } from "@material-ui/core";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "Checkbox",
  component: renderComponent(Component, {}, ({ props, children }) => (
    <FormControlLabel label="checkbox" control={children(props)} />
  )),
} as ComponentMeta<typeof Component>;

const checkbox = Checkbox("checkbox");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await checkbox.exists()
    await checkbox.is({ checked: false })
    await checkbox.is({ focused: false })
    await Checkbox({ disabled: false }).exists()
  }
}

export const ClickAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await checkbox.click()
    await checkbox.is({ checked: true, focused: true })
  }
}

export const FocusAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await checkbox.focus()
    await checkbox.is({ focused: true })
  }
}

export const CheckAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await checkbox.check()
    await checkbox.is({ checked: true })
  }
}

export const ToggleAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await checkbox.toggle()
    await checkbox.is({ checked: true })
    await checkbox.toggle()
    await checkbox.is({ checked: false })
  }
}

export const Indeterminate: ComponentStoryObj<typeof Component> = {
  args: { indeterminate: true },
  async play() {
    await checkbox.is({ indeterminate: true })
  }
}

export const Checked: ComponentStoryObj<typeof Component> = {
  render: () => <FormControlLabel label="checkbox" checked control={<Component />} />,
  async play() {
    await checkbox.is({ checked: true })
  }
}

export const Disabled: ComponentStoryObj<typeof Component> = {
  render: () => <FormControlLabel label="checkbox" disabled control={<Component />} />,
  async play() {
    await Checkbox({ disabled: true }).exists()
  }
}

export const Visible: ComponentStoryObj<typeof Component> = {
  render: () => <Component style={{ visibility: "hidden" }} />,
  async play() {
    await Checkbox({ visible: false }).exists()
  }
}

export const UncheckAction: ComponentStoryObj<typeof Component> = {
  args: { defaultChecked: true },
  async play() {
    await checkbox.uncheck()
    await checkbox.is({ checked: false })
  }
}

export const BlurActionAutoFocus: ComponentStoryObj<typeof Component> = {
  args: { autoFocus: true },
  async play() {
    await checkbox.is({ focused: true })
    await checkbox.blur()
    await checkbox.is({ focused: false })
  }
}

export const BodyClickAutoFocus: ComponentStoryObj<typeof Component> = {
  args: { autoFocus: true },
  async play() {
    await checkbox.is({ focused: true })
    await Body().click()
    await checkbox.is({ focused: false })
  }
}
