import { Popover } from "../src";
import { Button, Popover as Component } from "@material-ui/core";
import { renderComponent } from "./helpers";
import { cloneElement, useRef, useState } from "react";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "Popover",
  component: renderComponent(Component, { children: "Content" }, ({ props, children }) => {
    let [isOpen, setIsOpen] = useState<boolean>(true);

    let buttonRef = useRef<HTMLButtonElement | null>(null);

    let handleClick = () => setIsOpen(true);
    let handleClose = () => setIsOpen(false);

    return (
      <>
        <Button ref={buttonRef} onClick={handleClick}>
          Button
        </Button>
        {cloneElement(children(props), { open: isOpen, anchorEl: buttonRef.current, onClose: handleClose })}
      </>
    );
  }),
} as ComponentMeta<typeof Component>;

const popover = Popover("Content");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await popover.exists();
    await popover.close();
    await popover.absent();
  },
};
