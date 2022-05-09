import { some, TextField, matching } from "../src";
import { TextField as Component } from "@material-ui/core";
import { renderComponent } from "./helpers";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "TextField",
  component: renderComponent(Component, {
    id: "text-field-id",
    label: "textfield",
    helperText: "TextField",
    placeholder: "Enter text",
  }),
} as ComponentMeta<typeof Component>;

const textfield = TextField("textfield");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await textfield.exists();
    await textfield.has({ value: "" });
    await textfield.has({ placeholder: "Enter text" });
    await textfield.has({ description: "TextField" });
    await textfield.has({ classList: some(matching(/MuiInputBase-input(-\d+)?/)) });
    await textfield.is({ valid: true });
    await textfield.is({ focused: false });
    await TextField({ disabled: false }).exists();
  },
};

export const FillInAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await textfield.fillIn("Hello from BigTest");
    await textfield.has({ value: "Hello from BigTest" });
  },
};

export const FocusAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await textfield.focus();
    await textfield.is({ focused: true });
  },
};

export const Required: ComponentStoryObj<typeof Component> = {
  args: { required: true },
  async play() {
    await TextField(matching(/textfield\s\*/)).is({ required: true });
  },
};

export const Error: ComponentStoryObj<typeof Component> = {
  args: { error: true },
  async play() {
    await textfield.is({ valid: false });
  },
};

export const Disabled: ComponentStoryObj<typeof Component> = {
  args: { disabled: true },
  async play() {
    await textfield.absent();
    await TextField({ disabled: true }).exists();
  },
};

export const Multiline: ComponentStoryObj<typeof Component> = {
  args: { multiline: true },
  async play() {
    await textfield.exists();
  },
};

export const IdUndefined: ComponentStoryObj<typeof Component> = {
  args: { id: undefined },
  async play() {
    await textfield.exists();
  },
};

export const LabelUndefined: ComponentStoryObj<typeof Component> = {
  args: { id: undefined, label: undefined },
  async play() {
    await textfield.absent();
    await TextField("Enter text").exists();
  },
};
