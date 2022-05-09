import { matching, Snackbar, some } from "../src";
import { Snackbar as Component } from "@material-ui/core";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "Snackbar",
  component: renderComponent(Component, { message: "Snackbar", open: true }),
} as ComponentMeta<typeof Component>;

const snackbar = Snackbar("Snackbar");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await snackbar.exists();
    await snackbar.has({ classList: some(matching(/MuiSnackbar-root(-\d+)?/)) });
  },
};
