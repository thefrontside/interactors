import { Button, Dialog, matching, some, including } from "../src";
import {
  Button as ButtonComponent,
  Dialog as Component,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { renderComponent } from "./helpers";
import { cloneElement, useCallback, useState } from "react";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "Dialog",
  component: renderComponent(
    Component,
    {
      "aria-labelledby": "dialog-title",
    },
    ({ props, children }) => {
      let [open, setOpen] = useState(true);
      let onClose = useCallback(() => setOpen(false), []);

      return cloneElement(
        children(props),
        { open, onClose },
        <DialogTitle id="dialog-title">dialog</DialogTitle>,
        <DialogContent>Content</DialogContent>,
        <DialogActions>
          <ButtonComponent color="primary">Save</ButtonComponent>
        </DialogActions>
      );
    }
  ),
} as ComponentMeta<typeof Component>;

const dialog = Dialog("dialog");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await dialog.exists();
    await dialog.has({ text: including("Content") });
    await dialog.has({ classList: some(matching(/MuiDialog-root(-\d+)?/)) });
    await dialog.find(Button("Save".toUpperCase())).exists();
  },
};

export const CloseAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await dialog.close();
    await Dialog("dialog").absent();
  },
};
