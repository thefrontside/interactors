import { TextField as Component } from "@material-ui/core";
import { DateField, matching, some } from "../src";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "DateField",
  component: renderComponent(Component, { id: "datefield", label: "datefield", type: "date" }),
} as ComponentMeta<typeof Component>;

const datefield = DateField("datefield");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await datefield.has({ value: "" });
    await datefield.has({ classList: some(matching(/MuiInput-input(-\d+)?/)) });
  },
};

export const FillInActionString: ComponentStoryObj<typeof Component> = {
  async play() {
    await datefield.fillIn("2014-08-18");
    await datefield.has({ value: "2014-08-18" });
    await datefield.has({ date: new Date("2014-08-18") });
    await datefield.has({ timestamp: new Date("2014-08-18").getTime() });
  },
};

export const FillInActionDate: ComponentStoryObj<typeof Component> = {
  async play() {
    await datefield.fillIn(new Date("2014-08-18"));
    await datefield.has({ value: "2014-08-18" });
  },
};

export const FillInActionWithMinMax: ComponentStoryObj<typeof Component> = {
  args: { inputProps: { min: "2013-07-15", max: "2015-09-21" } },
  async play() {
    await datefield.fillIn("2014-08-18");
    await datefield.has({ value: "2014-08-18" });
  },
};

export const FillInActionBelowMin: ComponentStoryObj<typeof Component> = {
  args: { inputProps: { min: "2013-07-15", max: "2015-09-21" } },
  async play() {
    await datefield.fillIn("2012-06-13");
    await datefield.has({ value: "2012-06-13" });
  },
};

export const FillInActionAboveMax: ComponentStoryObj<typeof Component> = {
  args: { inputProps: { min: "2013-07-15", max: "2015-09-21" } },
  async play() {
    await datefield.fillIn("2016-10-26");
    await datefield.has({ value: "2016-10-26" });
  },
};
