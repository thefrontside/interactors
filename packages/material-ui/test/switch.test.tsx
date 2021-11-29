import { test, visit } from "bigtest";
import { Body } from "../src/body";
import { matching, some, Switch } from "../src";
import { Switch as Component, FormControlLabel } from "@material-ui/core";
import { createRenderStep, render } from "./helpers";

const renderSwitch = createRenderStep(Component, {}, ({ props, children }) => (
  <FormControlLabel label="switch" control={children(props)} />
));
const switcher = Switch("switch");

export default test("Switch")
  .step(visit("/"))
  .child("default render", (test) =>
    test
      .step(renderSwitch())
      .assertion(switcher.exists())
      .assertion(switcher.is({ checked: false }))
      .assertion(switcher.is({ focused: false }))
      .assertion(switcher.has({ classList: some(matching(/MuiSwitch-input-\d+/)) }))
      .assertion(Switch({ disabled: false }).exists())
      .child("test `click` action", (test) =>
        test
          .step(switcher.click())
          .assertion(switcher.is({ checked: true, focused: true }))
      )
      .child("test `focus` action", (test) =>
        test
          .step(switcher.focus())
          .assertion(switcher.is({ focused: true }))
      )
      .child("test `check` action", (test) =>
        test
          .step(switcher.check())
          .assertion(switcher.is({ checked: true }))
      )
      .child("test `toggle` action", (test) =>
        test
          .step(switcher.toggle())
          .assertion(switcher.is({ checked: true }))
          .child("toggle twice", (test) =>
            test
              .step(switcher.toggle())
              .assertion(switcher.is({ checked: false }))
          )
      )
  )
  .child("test `filter` by checked", (test) =>
    test
      .step(render(<FormControlLabel label="switch" checked control={<Component />} />))
      .assertion(switcher.is({ checked: true }))
  )
  .child("test `filter` by disabled", (test) =>
    test
      .step(render(<FormControlLabel label="switch" disabled control={<Component />} />))
      .assertion(Switch({ disabled: true }).exists())
  )
  .child("test `filter` by visible", (test) =>
    test
      .step(render(<Component style={{ visibility: 'hidden' }} />))
      .assertion(Switch({ visible: false }).exists())
  )

  .child("test `uncheck` action", (test) =>
    test
      .step(renderSwitch({ defaultChecked: true }))
      .step(switcher.uncheck())
      .assertion(switcher.is({ checked: false }))
  )
  .child("autoFocus", (test) =>
    test
      .step(renderSwitch({ autoFocus: true }))
      .assertion(switcher.is({ focused: true }))
      .child("test `blur` action", (test) =>
        test
          .step(switcher.blur())
          .assertion(switcher.is({ focused: false }))
      )
      .child("test click outside", (test) =>
        test
          .step("click to the body", () => Body().click())
          .assertion(switcher.is({ focused: false }))
      )
  );
