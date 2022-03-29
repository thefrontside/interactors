import { Fab, including, HTML, some, matching } from "../src";
import { Fab as Component, Icon } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "Fab",
  component: renderComponent(Component, { children: "My Fab" }),
} as ComponentMeta<typeof Component>;

const fab = Fab("My Fab".toUpperCase());
const Span = HTML.selector("span");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await fab.exists();
    await fab.has({ classList: some(matching(/MuiFab-root(-\d+)?/)) });
    await fab.has({ text: "My Fab".toUpperCase() });
  },
};

export const Extended: ComponentStoryObj<typeof Component> = {
  args: { variant: "extended" },
  async play() {
    await fab.has({ className: including("MuiFab-extended") });
  },
};

export const WithIcon: ComponentStoryObj<typeof Component> = {
  args: { children: <Icon data-testid="icon" className={"child-woof"} /> },
  async play() {
    await Fab()
      .find(Span({ className: including("child-woof") }))
      .exists();
  },
};

export const WithAriaLabel: ComponentStoryObj<typeof Component> = {
  args: { color: "primary", "aria-label": "add", children: <Add /> },
  async play() {
    await Fab("add").has({ svgIcon: true });
  },
};
