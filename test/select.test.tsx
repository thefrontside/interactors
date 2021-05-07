import { test, Page } from "bigtest";
import { Select, MultiSelect } from "../src/index";
import { Select as Component, FormControl, InputLabel, MenuItem, Chip, FormHelperText } from "@material-ui/core";
import { createRenderStep } from "./helpers";
import { cloneElement } from "react";

const plainOptions = [
  <MenuItem aria-label="None" value="" />,
  <MenuItem value="one">one</MenuItem>,
  <MenuItem value="two">two</MenuItem>,
  <MenuItem value="three">three</MenuItem>,
]

const renderSelect = createRenderStep(
  Component,
  {
    id: 'select-id',
    labelId: "label-id",
    defaultValue: '',
    inputProps: { id: 'input-id' },
    renderValue: (selected) => (
      <>
        {(typeof selected == 'string' ? [selected] : selected as string[]).map((value) => (
          <Chip key={value} label={value} />
        ))}
      </>
    ),
  },
  ({ props, children }) => (
    <FormControl>
      <InputLabel id="label-id" htmlFor="input-id">select</InputLabel>
      {cloneElement(children(props), {}, ...plainOptions)}
      <FormHelperText>SelectField</FormHelperText>
    </FormControl>
  )
);
const select = Select("select");
const multiSelect = MultiSelect("select");

export default test("Select")
  .step(Page.visit("/"))
  .child('singular', (test) =>
    test
      .child("default", (test) =>
        test
          .step(renderSelect({ multiple: false }))
          .assertion(select.exists())
          .assertion(select.has({ required: false }))
          .assertion(select.has({ valid: true }))
          .assertion(select.has({ value: "\u200B" }))
          .assertion(select.has({ description: 'SelectField' }))
          .assertion(Select({ disabled: false}).exists())
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
      .child("inputProps={undefined}", (test) =>
        test
          .step(renderSelect({ inputProps: undefined }))
          .assertion(select.exists())
          .assertion(select.has({ description: 'SelectField' }))
      )
  )
  .child('multiple', (test) =>
    test
      .child("default", (test) =>
        test
          .step(renderSelect({ defaultValue: [], multiple: true }))
          .assertion(multiSelect.exists())
          .assertion(multiSelect.has({ required: false }))
          .assertion(multiSelect.has({ valid: true }))
          .assertion(multiSelect.has({ values: [] }))
          .assertion(select.has({ description: 'SelectField' }))
          .assertion(MultiSelect({ disabled: false}).exists())
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
              .child("test `choose` action", (test) =>
                test
                  .step(multiSelect.choose('three'))
                  .assertion(multiSelect.has({  values: ['three'] }))
              )
          )
      )
      .child("required={true}", (test) =>
        test
          .step(renderSelect({ defaultValue: [], multiple: true, required: true }))
          .assertion(multiSelect.has({ required: true }))
      )
  );
