import { FormControl, matching, some, Switch } from "../src";
import {
  FormControl as Component,
  InputLabel,
  FormHelperText,
  Switch as SwitchComponent,
  FormControlLabel,
} from "@material-ui/core";
import { renderComponent } from "./helpers";
import { cloneElement, useCallback, useState } from "react";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "FormControl",
  component: renderComponent(Component, {}, ({ props, children }) => {
    let [error, setError] = useState(false);
    let onChange = useCallback(
      (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => setError(checked),
      []
    );

    return cloneElement(
      children(props),
      { error },
      <InputLabel id="form-label">Toggler</InputLabel>,
      <FormControlLabel
        control={
          <SwitchComponent
            value={error}
            onChange={onChange}
            inputProps={{
              "aria-labelledby": "form-label",
              "aria-describedby": "form-description",
            }}
          />
        }
        label="Switch"
      />,
      <FormHelperText id="form-description">{error ? "Error" : "Toggle error"}</FormHelperText>
    );
  }),
} as ComponentMeta<typeof Component>;

const formControl = FormControl("Toggler");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await formControl.exists();
    await formControl.is({ valid: true });
    await formControl.has({ classList: some(matching(/MuiFormControl-root(-\d+)?/)) });
    await formControl.has({ description: "Toggle error" });
    await formControl.find(Switch("Switch")).exists();
  },
};

export const InvalidForm: ComponentStoryObj<typeof Component> = {
  async play() {
    await formControl.find(Switch("Switch")).toggle();
    await formControl.is({ valid: false });
    await formControl.has({ description: "Error" });
  },
};
