import { List, ListItem } from "../src";
import { List as Component, ListItem as ComponentItem } from "@material-ui/core";
import { renderComponent } from "./helpers";
import { cloneElement } from "react";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "List",
  component: renderComponent(Component, { "aria-label": "Three items list" }, ({ props, children }) => {
    return cloneElement(
      children(props),
      {},
      <ComponentItem>One</ComponentItem>,
      <ComponentItem>Two</ComponentItem>,
      <ComponentItem disabled>Three</ComponentItem>
    );
  }),
} as ComponentMeta<typeof Component>;

const list = List("Three items list");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await list.exists();
    await list.find(ListItem("One")).exists();
    await list.find(ListItem("Three", { disabled: true })).exists();
    await list.find(ListItem("Two")).is({ index: 1 });
  },
};
