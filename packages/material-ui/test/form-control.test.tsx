import { test } from "bigtest";
import { FormControl, matching, some, Switch, Page } from "../src";
import { FormControl as Component, InputLabel, FormHelperText, Switch as SwitchComponent, FormControlLabel } from "@material-ui/core";
import { createRenderStep } from "./helpers";
import { cloneElement, useCallback, useState } from "react";

const renderFormControl = createRenderStep(Component, {}, ({ props, children }) => {
  let [error, setError] = useState(false);
  let onChange = useCallback((_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => setError(checked), []);

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
            "aria-labelledby": 'form-label',
            "aria-describedby": 'form-description'
          }}
        />}
        label="Switch"
    />,
    <FormHelperText id="form-description">{error ? 'Error' : 'Toggle error'}</FormHelperText>,
  );
});
const formControl = FormControl("Toggler");

export default test("FormControl")
  .step(Page.visit("/"))
  .step(renderFormControl())
  .assertion(formControl.exists())
  .assertion(formControl.is({ valid: true }))
  .assertion(formControl.has({ classList: some(matching(/MuiFormControl-root-\d+/)) }))
  .assertion(formControl.has({ description: 'Toggle error' }))
  .assertion(formControl.find(Switch('Switch')).exists())
  .child('test invalid form', (test) =>
    test
      .step(formControl.find(Switch('Switch')).toggle())
      .assertion(formControl.is({ valid: false }))
      .assertion(formControl.has({ description: 'Error' }))
  );
