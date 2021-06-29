import { test, Page } from "bigtest";
import { Popover } from "../src/index";
import { Button, Popover as Component } from "@material-ui/core";
import { createRenderStep } from "./helpers";
import { cloneElement, useRef, useState } from "react";

const renderPopover = createRenderStep(Component, { children: 'Content' }, ({ props, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const handleClick = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button ref={buttonRef} onClick={handleClick}>Button</Button>
      {cloneElement(
        children(props),
        { open: isOpen, anchorEl: buttonRef.current, onClose: handleClose },
      )}
    </>
  )
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
  )
