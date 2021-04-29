import { test, Page } from "bigtest";
import { NativeSelect, NativeMultiSelect } from "../src/index";
import { Select as Component, FormControl, InputLabel } from "@material-ui/core";
import { createRenderStep } from "./helpers";

const plainOptions = (
  <>
    <option aria-label="None" value="" />
    <option value={1}>one</option>
    <option value={2}>two</option>
    <option value={3}>three</option>
  </>
)

const renderSelect = createRenderStep(
  Component,
  {
    native: true,
    defaultValue: '',
    inputProps: { id: 'select-id' },
    children: plainOptions
  },
  ({ props, children }) => (
    <FormControl>
      <InputLabel htmlFor="select-id">select</InputLabel>
      {children(props)}
    </FormControl>
  )
);
const select = NativeSelect("select");
const multiSelect = NativeMultiSelect("select");

export default test("Native Select")
  .step(Page.visit("/"))
  .child('singular', (test) =>
    test
      .child("default", (test) =>
        test
          .step(renderSelect({ multiple: false }))
          .assertion(select.exists())
          .assertion(select.has({ required: false }))
          .assertion(select.has({ focused: false }))
          .assertion(select.has({ valid: true }))
          .assertion(select.has({ value: "" }))
          .assertion(NativeSelect({ disabled: false}).exists())
          .child("test `focus` action", (test) =>
            test
              .step(select.focus())
              .assertion(select.has({ focused: true }))
          )
          .child("test `choose` action", (test) =>
            test
              .step(select.choose('one'))
              .assertion(select.has({ value: 'one' }))
          )
      )
      .child("required={true}", (test) =>
        test
          .step(renderSelect({ multiple: false, required: true }))
          .assertion(select.has({ required: true }))
      )
  )
  .child('multiple', (test) =>
    test
    .child("default", (test) =>
      test
        .step(renderSelect({ multiple: true }))
        .assertion(multiSelect.exists())
        .assertion(multiSelect.has({ required: false }))
        .assertion(multiSelect.has({ focused: false }))
        .assertion(multiSelect.has({ valid: true }))
        .assertion(multiSelect.has({ values: [] }))
        .assertion(NativeMultiSelect({ disabled: false}).exists())
        .child("test `focus` action", (test) =>
          test
            .step(multiSelect.focus())
            .assertion(multiSelect.has({ focused: true }))
        )
        .child("test `choose` action", (test) =>
          test
            .step(multiSelect.choose('one'))
            .assertion(multiSelect.has({ values: ['one'] }))
        )
        .child("test `select` action", (test) =>
          test
            .step(multiSelect.select('one'))
            .step(multiSelect.select('two'))
            .assertion(multiSelect.has({ values: ['one', 'two'] }))
            .child("test `deselect` action", (test) =>
              test
                .step(multiSelect.deselect('one'))
                .assertion(multiSelect.has({  values: ['two'] }))
            )
        )
    )
    .child("required={true}", (test) =>
      test
        .step(renderSelect({ multiple: true, required: true }))
        .assertion(multiSelect.has({ required: true }))
    )
  );
