import { test, Page } from "bigtest";
import { Body, CheckBox as Interactor } from "../src/index";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { render } from "./helpers";

export default test("Checkbox")
  .step(Page.visit("/"))
  .child("filter", (test) =>
    test
      .child("by locator", (test) =>
        test
          .step("render", () => render(<FormControlLabel label="locator" control={<Checkbox />} />))
          .assertion(Interactor("locator").exists())
      )
      .child("by checked", (test) =>
        test
          .step("render", () => render(<FormControlLabel label="checked" checked control={<Checkbox />} />))
          .assertion(Interactor({ checked: true }).exists())
      )
      .child("by indeterminate", (test) =>
        test
          .step("render", () => render(<FormControlLabel label="indeterminate" control={<Checkbox indeterminate />} />))
          .assertion(Interactor({ indeterminate: true }).exists())
      )
      .child("by disabled", (test) =>
        test
          .step("render", () => render(<FormControlLabel label="disabled" disabled control={<Checkbox />} />))
          .assertion(Interactor({ disabled: true }).exists())
      )
      .child("by visible", (test) =>
        test.step("render", () => render(<Checkbox />)).assertion(Interactor({ visible: false }).exists())
      )
  )
  .child("click", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox />} />))
      .child("default", (test) => test.assertion(Interactor("checkbox").is({ checked: false, focused: false })))
      .child("click", (test) =>
        test
          .step("click", () => Interactor("checkbox").click())
          // TODO `focused` doesn't set :(
          .assertion(Interactor("checkbox").is({ checked: true /*, focused: true */ }))
      )
  )
  .child("focus", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox />} />))
      .child("default", (test) => test.assertion(Interactor("checkbox").is({ focused: false })))
      .child("focus", (test) =>
        test.step("focus", () => Interactor("checkbox").focus()).assertion(Interactor("checkbox").is({ focused: true }))
      )
  )
  .child("blur", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox autoFocus />} />))
      .child("default", (test) => test.assertion(Interactor("checkbox").is({ focused: true })))
      .child("blur", (test) =>
        test.step("blur", () => Interactor("checkbox").blur()).assertion(Interactor("checkbox").is({ focused: false }))
      )
  )
  .child("check", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox />} />))
      .child("default", (test) => test.assertion(Interactor("checkbox").is({ checked: false })))
      .child("check", (test) =>
        test.step("check", () => Interactor("checkbox").check()).assertion(Interactor("checkbox").is({ checked: true }))
      )
  )
  .child("uncheck", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox defaultChecked />} />))
      .child("default", (test) => test.assertion(Interactor("checkbox").is({ checked: true })))
      .child("uncheck", (test) =>
        test
          .step("uncheck", () => Interactor("checkbox").uncheck())
          .assertion(Interactor("checkbox").is({ checked: false }))
      )
  )
  .child("toggle", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Checkbox />} />))
      .child("default", (test) => test.assertion(Interactor("checkbox").is({ checked: false })))
      .child("toggle 1", (test) =>
        test
          .step("toggle", () => Interactor("checkbox").toggle())
          .assertion(Interactor("checkbox").is({ checked: true }))
      )
      .child("toggle 2", (test) =>
        test
          .step("toggle", () => Interactor("checkbox").toggle())
          .step("toggle", () => Interactor("checkbox").toggle())
          .assertion(Interactor("checkbox").is({ checked: false }))
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
