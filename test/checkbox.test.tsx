import { test, Page } from "bigtest";
import { Body, Checkbox } from "../src/index";
import { Checkbox as Component, FormControlLabel } from "@material-ui/core";
import { getComponentRenderer, render } from "./helpers";

const renderComponent = getComponentRenderer(Component, {}, ({ props, children }) => (
  <FormControlLabel label="checkbox" control={children(props)} />
));
const checkbox = Checkbox("checkbox");

export default test("Checkbox")
  .step(Page.visit("/"))
  .child("default render", (test) =>
    test
      .step(renderComponent())
      .assertion(checkbox.exists())
      .assertion(Checkbox().is({ checked: false }))
      .assertion(Checkbox().is({ focused: false }))
      .assertion(Checkbox({ disabled: false }).exists())
      .child("test `click` action", (test) =>
        test.step(checkbox.click()).assertion(checkbox.is({ checked: true, focused: true }))
      )
      .child("test `focus` action", (test) => test.step(checkbox.focus()).assertion(checkbox.is({ focused: true })))
      .child("test `check` action", (test) => test.step(checkbox.check()).assertion(checkbox.is({ checked: true })))
      .child("test `toggle` action", (test) =>
        test
          .step(checkbox.toggle())
          .assertion(checkbox.is({ checked: true }))
          .child("toggle twice", (test) => test.step(checkbox.toggle()).assertion(checkbox.is({ checked: false })))
      )
  )
  .child("test `filter` by indeterminate", (test) =>
    test.step(renderComponent({ indeterminate: true })).assertion(checkbox.is({ indeterminate: true }))
  )
  .child("test `filter` by checked", (test) =>
    test
      .step(render(<FormControlLabel label="checkbox" checked control={<Component />} />))
      .assertion(checkbox.is({ checked: true }))
  )
  .child("test `filter` by disabled", (test) =>
    test
      .step(render(<FormControlLabel label="checkbox" disabled control={<Component />} />))
      .assertion(Checkbox({ disabled: true }).exists())
  )
  .child("test `filter` by visible", (test) =>
    test.step(render(<Component />)).assertion(Checkbox({ visible: false }).exists())
  )

  .child("test `uncheck` action", (test) =>
    test
      .step(renderComponent({ defaultChecked: true }))
      .step(checkbox.uncheck())
      .assertion(checkbox.is({ checked: false }))
  )
  .child("autoFocus", (test) =>
    test
      .step(renderComponent({ autoFocus: true }))
      .assertion(checkbox.is({ focused: true }))
      .child("test `blur` action", (test) => test.step(checkbox.blur()).assertion(checkbox.is({ focused: false })))
      .child("test click outside", (test) =>
        test.step("click to the body", () => Body().click()).assertion(checkbox.is({ focused: false }))
      )
  );
