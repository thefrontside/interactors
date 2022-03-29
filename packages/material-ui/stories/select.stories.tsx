import { Select, MultiSelect, some, matching } from "../src";
import { Select as Component, FormControl, InputLabel, MenuItem, Chip, FormHelperText } from "@material-ui/core";
import { renderComponent } from "./helpers";
import { cloneElement } from "react";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

const plainOptions = [
  <MenuItem aria-label="None" value="" />,
  <MenuItem value="one">one</MenuItem>,
  <MenuItem value="two">two</MenuItem>,
  <MenuItem value="three">three</MenuItem>,
];

export default {
  title: "Select",
  component: renderComponent(
    Component,
    {
      id: "select-id",
      labelId: "label-id",
      defaultValue: "",
      inputProps: { id: "input-id" },
      renderValue: (selected) => (
        <>
          {(typeof selected == "string" ? [selected] : (selected as string[])).map((value) => (
            <Chip key={value} label={value} />
          ))}
        </>
      ),
    },
    ({ props, children }) => (
      <FormControl>
        <InputLabel id="label-id" htmlFor="input-id">
          select
        </InputLabel>
        {cloneElement(children(props), {}, ...plainOptions)}
        <FormHelperText>SelectField</FormHelperText>
      </FormControl>
    )
  ),
} as ComponentMeta<typeof Component>;

const select = Select("select");
const multiSelect = MultiSelect("select");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await select.exists();
    await select.has({ required: false });
    await select.has({ valid: true });
    await select.has({ value: "\u200B" });
    await select.has({ description: "SelectField" });
    await select.has({ classList: some(matching(/MuiInputBase-root(-\d+)?/)) });
    await Select({ disabled: false }).exists();
  },
};

export const ChooseAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await select.choose("one");
    await select.has({ value: "one" });
  },
};

export const Required: ComponentStoryObj<typeof Component> = {
  args: { required: true },
  async play() {
    await select.has({ required: true });
  },
};

export const InputPropsUndefined: ComponentStoryObj<typeof Component> = {
  args: { inputProps: undefined },
  async play() {
    await select.exists();
    await select.has({ description: "SelectField" });
  },
};

export const LabelIdUndefined: ComponentStoryObj<typeof Component> = {
  args: { inputProps: undefined, labelId: undefined },
  async play() {
    await select.exists();
  },
};

export const DefaultMultiple: ComponentStoryObj<typeof Component> = {
  args: { multiple: true, defaultValue: [] },
  async play() {
    await multiSelect.exists();
    await multiSelect.has({ required: false });
    await multiSelect.has({ valid: true });
    await multiSelect.has({ values: [] });
    await multiSelect.has({ classList: some(matching(/MuiInputBase-root(-\d+)?/)) });
    await multiSelect.has({ description: "SelectField" });
    await MultiSelect({ disabled: false }).exists();
  },
};

export const SelectActionMultiple: ComponentStoryObj<typeof Component> = {
  args: { multiple: true, defaultValue: [] },
  async play() {
    await multiSelect.select("one");
    await multiSelect.select("two");
    await multiSelect.has({ values: ["one", "two"] });
    await multiSelect.deselect("one");
    await multiSelect.has({ values: ["two"] });
    await multiSelect.choose("three");
    await multiSelect.has({ values: ["three"] });
  },
};

export const RequiredMultiple: ComponentStoryObj<typeof Component> = {
  args: { multiple: true, required: true, defaultValue: [] },
  async play() {
    await multiSelect.has({ required: true });
  },
};
