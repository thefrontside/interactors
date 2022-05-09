import { TextField as Component } from "@material-ui/core";
import { matching, some, TimeField } from "../src";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "TimeField",
  component: renderComponent(Component, { id: "timefield", label: "timefield", type: "time" }),
} as ComponentMeta<typeof Component>;

const timefield = TimeField("timefield");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await timefield.has({ value: "" });
    await timefield.has({ classList: some(matching(/MuiInputBase-input(-\d+)?/)) });
  },
};

export const FillInActionString: ComponentStoryObj<typeof Component> = {
  async play() {
    await timefield.fillIn("09:13:37.512");
    await timefield.has({ value: "09:13:37.512" });
    await timefield.has({ date: new Date("1970-01-01T09:13:37.512Z") });
    await timefield.has({ timestamp: new Date("1970-01-01T09:13:37.512Z").getTime() });
  },
};

export const FillInActionDate: ComponentStoryObj<typeof Component> = {
  async play() {
    await timefield.fillIn(new Date("2014-08-18T09:13:37.512Z"));
    await timefield.has({ value: "09:13:37.512" });
  },
};

export const FillInActionWithoutSeconds: ComponentStoryObj<typeof Component> = {
  async play() {
    await timefield.fillIn("09:13");
    await timefield.has({ value: "09:13" });
  },
};

export const FillInActionWithSeconds: ComponentStoryObj<typeof Component> = {
  async play() {
    await timefield.fillIn("09:13:37");
    await timefield.has({ value: "09:13:37" });
  },
};
