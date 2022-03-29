import { Radio } from "../src";
import { Radio as Component } from "@material-ui/core";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "Radio",
  component: renderComponent(Component),
} as ComponentMeta<typeof Component>;

const radio = Radio();

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await radio.exists();
    await radio.is({ checked: false });
  },
};
