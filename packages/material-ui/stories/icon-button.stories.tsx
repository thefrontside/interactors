import { createInteractor, including } from "@interactors/html";
import { Button } from "../src";
import { IconButton as Component } from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "IconButton",
  component: renderComponent(Component, { "aria-label": "upload picture", children: <PhotoCamera /> }),
} as ComponentMeta<typeof Component>;

const button = Button("upload picture");

const SVG = createInteractor<SVGElement>("svg")
  .selector("svg")
  .filters({ className: (element) => element.classList.toString() });

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await button.exists();
    await button.find(SVG()).has({ className: including("MuiSvgIcon-root") });
  },
};
