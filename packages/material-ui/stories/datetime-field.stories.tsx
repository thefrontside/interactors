import { TextField as Component } from "@material-ui/core";
import { DateTimeField, matching, some } from "../src";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "DateTimeField",
  component: renderComponent(Component, {
    id: "datetimefield",
    label: "datetimefield",
    type: "datetime-local",
  }),
} as ComponentMeta<typeof Component>;

const datetimefield = DateTimeField("datetimefield");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await datetimefield.has({ value: "" });
    await datetimefield.has({ classList: some(matching(/MuiInput-input(-\d+)?/)) });
  },
};

export const FillInActionString: ComponentStoryObj<typeof Component> = {
  async play() {
    await datetimefield.fillIn("2014-08-18T09:13:37.512");
    await datetimefield.has({ value: "2014-08-18T09:13:37.512" });
    await datetimefield.has({ timestamp: new Date("2014-08-18T09:13:37.512Z").getTime() });
  },
};

export const FillInActionDate: ComponentStoryObj<typeof Component> = {
  async play() {
    await datetimefield.fillIn(new Date("2014-08-18T09:13:37.512Z"));
    await datetimefield.has({ value: "2014-08-18T09:13:37.512" });
  },
};

export const FillInActionWithoutSeconds: ComponentStoryObj<typeof Component> = {
  async play() {
    await datetimefield.fillIn("2014-08-18T09:13");
    await datetimefield.has({ value: "2014-08-18T09:13" });
  },
};

export const FillInActionWithSeconds: ComponentStoryObj<typeof Component> = {
  async play() {
    await datetimefield.fillIn("2014-08-18T09:13:37");
    await datetimefield.has({ value: "2014-08-18T09:13:37" });
  },
};
