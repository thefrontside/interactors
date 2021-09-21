import { test } from "@bigtest/suite";
import { Popover, Page } from "../src";
import { Button, Popover as Component } from "@material-ui/core";
import { createRenderStep } from "./helpers";
import { cloneElement, useRef, useState } from "react";

const renderPopover = createRenderStep(Component, { children: 'Content' }, ({ props, children }) => {
  let [isOpen, setIsOpen] = useState<boolean>(true);

  let buttonRef = useRef<HTMLButtonElement | null>(null);

  let handleClick = () => setIsOpen(true);
  let handleClose = () => setIsOpen(false);

  return (
    <>
      <Button ref={buttonRef} onClick={handleClick}>Button</Button>
      {cloneElement(
        children(props),
        { open: isOpen, anchorEl: buttonRef.current, onClose: handleClose },
      )}
    </>
  );
});
const popover = Popover("Content");

export default test("Popover")
  .step(Page.visit("/"))
  .step(renderPopover())
  .assertion(popover.exists())
  .child('test `close` action', (test) =>
    test
      .step(popover.close())
      .assertion(popover.absent())
  );
