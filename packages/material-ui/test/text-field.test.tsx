import { test } from "@bigtest/suite";
import { some, TextField, Page, matching } from "../src";
import { TextField as Component } from "@material-ui/core";
import { createRenderStep } from "./helpers";

const renderTextField = createRenderStep(
  Component,
  {
    id: 'text-field-id',
    label: 'textfield',
    helperText: 'TextField',
    placeholder: 'Enter text'
  }
);
const textfield = TextField("textfield");

export default test("TextField")
  .step(Page.visit("/"))
  .child("default render", (test) =>
    test
      .step(renderTextField())
      .assertion(textfield.exists())
      .assertion(textfield.has({ value: '' }))
      .assertion(textfield.has({ placeholder: 'Enter text' }))
      .assertion(textfield.has({ description: 'TextField' }))
      .assertion(textfield.has({ classList: some(matching(/MuiInputBase-input-\d+/)) }))
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
      .assertion(textfield.absent())
      .assertion(TextField({ disabled: true }).exists())
  )
  .child("multiline={true}", (test) =>
    test
      .step(renderTextField({ multiline: true }))
      .assertion(textfield.exists())
  )
  .child("id={undefined}", (test) =>
    test
      .step(renderTextField({ id: undefined }))
      .assertion(textfield.exists())
  )
  .child("id={undefined} label={undefined}", (test) =>
    test
      .step(renderTextField({ id: undefined, label: undefined }))
      .assertion(textfield.absent())
      .assertion(TextField('Enter text').exists())
  );
