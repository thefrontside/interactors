import { matching, some, Tab, Tabs } from "../src";
import { Tabs as Component, Tab as TabComponent } from "@material-ui/core";
import { renderComponent } from "./helpers";
import { cloneElement, useState } from "react";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "Tabs",
  component: renderComponent(
    Component,
    {
      "aria-label": "tabs",
    },
    ({ props, children }) => {
      let [value, setValue] = useState(2);

      let handleChange = (_event: unknown, newValue: number) => setValue(newValue);

      return cloneElement(
        children(props),
        { value, onChange: handleChange },
        <TabComponent label="One" />,
        <TabComponent label="Two" disabled />,
        <TabComponent label="Three" />
      );
    }
  ),
} as ComponentMeta<typeof Component>;

const tabs = Tabs("tabs");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await tabs.exists();
    await tabs.has({ value: "THREE" });
    await tabs.has({ classList: some(matching(/MuiTabs-root(-\d+)?/)) });
    await tabs.find(Tab({ disabled: true })).exists();
  },
};

export const ClickAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await tabs.click("ONE");
    await tabs.has({ value: "ONE" });
  },
};
