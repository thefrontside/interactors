import { test, Page, matching } from "bigtest";
import { TextField } from "../src/index";
import { TextField as Component } from "@material-ui/core";
import { createRenderStep } from "./helpers";

const renderTextField = createRenderStep(Component, { id: 'text-field-id', label: 'textfield', helperText: 'TextField' });
const textfield = TextField("textfield");

export default test("TextField")
  .step(Page.visit("/"))
  .child("default render", (test) =>
    test
      .step(renderTextField())
      .assertion(textfield.exists())
      .assertion(textfield.has({ value: '' }))
      .assertion(textfield.has({ placeholder: '' }))
      .assertion(textfield.has({ description: 'TextField' }))
      .assertion(textfield.is({ valid: true }))
      .assertion(textfield.is({ focused: false }))
      .assertion(TextField({ disabled: false }).exists())
      .child("test `fillIn` action", (test) =>
        test
          .step(textfield.fillIn('Hello from BigTest'))
          .assertion(textfield.has({ value: 'Hello from BigTest' }))
      )
      .child("test `focus` action", (test) =>
        test
          .step(textfield.focus())
          .assertion(textfield.is({ focused: true }))
      )
  )
  .child("required={true}", (test) =>
    test
      .step(renderTextField({ required: true }))
      .assertion(TextField(matching(/textfield\s\*/)).is({ required: true }))
  )
  .child("error={true}", (test) =>
    test
      .step(renderTextField({ error: true }))
      .assertion(textfield.is({ valid: false }))
  )
  .child("disabled={true}", (test) =>
    test
      .step(renderTextField({ disabled: true }))
      .assertion(TextField({ disabled: true }).exists())
  )
  .child("multiline={true}", (test) =>
    test
      .step(renderTextField({ multiline: true }))
      .assertion(textfield.exists())
  )
