import { NativeSelect, NativeMultiSelect, some, matching } from "../src";
import { Select as Component, FormControl, InputLabel } from "@material-ui/core";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

const plainOptions = (
  <>
    <option aria-label="None" value="" />
    <option value={1}>one</option>
    <option value={2}>two</option>
    <option value={3}>three</option>
  </>
);

export default {
  title: "NativeSelect",
  component: renderComponent(
    Component,
    {
      native: true,
      defaultValue: "",
      inputProps: { id: "select-id" },
      children: plainOptions,
    },
    ({ props, children }) => (
      <FormControl>
        <InputLabel htmlFor="select-id">select</InputLabel>
        {children(props)}
      </FormControl>
    )
  ),
} as ComponentMeta<typeof Component>;

const select = NativeSelect("select");
const multiSelect = NativeMultiSelect("select");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await select.exists();
    await select.has({ required: false });
    await select.has({ focused: false });
    await select.has({ valid: true });
    await select.has({ value: "" });
    await select.has({ classList: some(matching(/MuiSelect-root(-\d+)?/)) });
    await NativeSelect({ disabled: false }).exists();
  },
};

export const FocusAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await select.focus();
    await select.has({ focused: true });
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

export const DefaultMultiple: ComponentStoryObj<typeof Component> = {
  args: { multiple: true },
  async play() {
    await multiSelect.exists();
    await multiSelect.has({ required: false });
    await multiSelect.has({ focused: false });
    await multiSelect.has({ valid: true });
    await multiSelect.has({ values: [] });
    await multiSelect.has({ classList: some(matching(/MuiSelect-root(-\d+)?/)) });
    await NativeMultiSelect({ disabled: false }).exists();
  },
};

export const FocusActionMultiple: ComponentStoryObj<typeof Component> = {
  args: { multiple: true },
  async play() {
    await multiSelect.focus();
    await multiSelect.has({ focused: true });
  },
};

export const ChooseActionMultiple: ComponentStoryObj<typeof Component> = {
  args: { multiple: true },
  async play() {
    await multiSelect.choose("one");
    await multiSelect.has({ values: ["one"] });
  },
};

export const SelectActionMultiple: ComponentStoryObj<typeof Component> = {
  args: { multiple: true },
  async play() {
    await multiSelect.select("one");
    await multiSelect.select("two");
    await multiSelect.has({ values: ["one", "two"] });
    await multiSelect.deselect("one");
    await multiSelect.has({ values: ["two"] });
  },
};

export const RequiredMultiple: ComponentStoryObj<typeof Component> = {
  args: { required: true, multiple: true },
  async play() {
    await multiSelect.has({ required: true });
  },
};
