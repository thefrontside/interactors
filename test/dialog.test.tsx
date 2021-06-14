import { test, Page, including } from "bigtest";
import { Button, Dialog } from "../src/index";
import { Button as ButtonComponent, Dialog as Component, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { createRenderStep } from "./helpers";
import { cloneElement, useCallback, useState } from "react";

const renderDialog = createRenderStep(Component, {
  'aria-labelledby': 'dialog-title'
}, ({ props, children }) => {
  const [open, setOpen] = useState(true)
  const onClose = useCallback(() => setOpen(false), [])

  return cloneElement(
    children(props),
    { open, onClose },
    <DialogTitle id="dialog-title">dialog</DialogTitle>,
    <DialogContent>Content</DialogContent>,
    <DialogActions>
      <ButtonComponent color="primary">
        Save
      </ButtonComponent>
    </DialogActions>,
  )
});
const dialog = Dialog("dialog");

export default test("Dialog")
  .step(Page.visit("/"))
  .step(renderDialog())
  .assertion(dialog.exists())
  .assertion(dialog.has({ text: including('Content') }))
  .assertion(dialog.find(Button('Save'.toUpperCase())).exists())
  .child('test `close` action', (test) =>
    test
      .step(dialog.close())
      .assertion(Dialog("dialog").absent())
  )
