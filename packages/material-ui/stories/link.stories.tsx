import { Link as Component } from "@material-ui/core";
import { Link, matching, some } from "../src";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "Link",
  component: renderComponent(Component, { children: "link", href: "https://material-ui.com/components/links/" }),
} as ComponentMeta<typeof Component>;

const link = Link("link");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await link.exists();
    await link.has({ classList: some(matching(/MuiLink-root(-\d+)?/)) });
    await link.has({ href: "https://material-ui.com/components/links/" });
  },
};
