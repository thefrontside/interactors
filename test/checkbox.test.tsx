import { test, Page } from "bigtest";
import { Body, CheckBox as Interactor } from "../src/index";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { render } from "./helpers";

export default test("Checkbox")
  .step(Page.visit("/"))
  .child("test `filter` by locator", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="locator" control={<Checkbox />} />))
      .assertion(Interactor().exists())
  )
  .child("test `filter` by checked", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checked" checked control={<Checkbox />} />))
      .assertion(Interactor({ checked: true }).exists())
  )
  .child("test `filter` by indeterminate", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="indeterminate" control={<Checkbox indeterminate />} />))
      .assertion(Interactor({ indeterminate: true }).exists())
  )
  .child("test `filter` by disabled", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="disabled" disabled control={<Checkbox />} />))
      .assertion(Interactor({ disabled: true }).exists())
  )
  .child("test `filter` by visible", (test) =>
    test.step("render", () => render(<Checkbox />)).assertion(Interactor({ visible: false }).exists())
  )
  .child("test `click` action", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox />} />))
      .assertion(Interactor().is({ checked: false, focused: false }))
      .child("click and assert", (test) =>
        test
          .step(Interactor().click())
          // TODO `focused` doesn't set :(
          .assertion(Interactor().is({ checked: true /*, focused: true */ }))
      )
  )
  .child("test `focus` action", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox />} />))
      .assertion(Interactor().is({ focused: false }))
      .child("focus and assert", (test) =>
        test.step(Interactor().focus()).assertion(Interactor().is({ focused: true }))
      )
  )
  .child("test `blur` action", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox autoFocus />} />))
      .assertion(Interactor().is({ focused: true }))
      .child("blur and assert", (test) => test.step(Interactor().blur()).assertion(Interactor().is({ focused: false })))
  )
  .child("test `check` action", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox />} />))
      .assertion(Interactor().is({ checked: false }))
      .child("check and assert", (test) =>
        test.step(Interactor().check()).assertion(Interactor().is({ checked: true }))
      )
  )
  .child("test `uncheck` action", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox defaultChecked />} />))
      .assertion(Interactor().is({ checked: true }))
      .child("uncheck and assert", (test) =>
        test.step(Interactor().uncheck()).assertion(Interactor().is({ checked: false }))
      )
  )
  // NOTE: Here is nice example of duplicating tests by useless parallelism
  .child("test `toggle` action", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox />} />))
      .assertion(Interactor().is({ checked: false }))
      .child("toggle twice", (test) =>
        test
          .step(Interactor().toggle())
          .assertion(Interactor().is({ checked: true }))
          .child("second toggle", (test) =>
            test.step(Interactor().toggle()).assertion(Interactor().is({ checked: false }))
          )
      )
  );
// TODO Don't work because `click` doesn't affect to `document.activeElement`
// .child("click out side", (test) =>
//   test
//     .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox />} />))
//     .step("focus", () => Interactor("checkbox").focus())
//     .step("focus the body", () => Body().click())
//     .assertion(Interactor("checkbox").is({ focused: false }))
// );
