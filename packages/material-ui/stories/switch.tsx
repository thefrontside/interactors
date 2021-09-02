import { useCallback, useState } from "react";
import { FormGroup, FormControlLabel, Switch } from "@material-ui/core";

export const SwitchLabels = (): JSX.Element => {
  let [state, setState] = useState({
    checkedA: true,
    checkedB: true,
  });

  let handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, [event.target.name]: event.target.checked }),
    [state]
  );

  return (
    <FormGroup row>
      <FormControlLabel
        control={<Switch checked={state.checkedA} onChange={handleChange} name="checkedA" />}
        label="Secondary"
      />
      <FormControlLabel
        control={<Switch checked={state.checkedB} onChange={handleChange} name="checkedB" color="primary" />}
        label="Primary"
      />
      <FormControlLabel control={<Switch />} label="Uncontrolled" />
      <FormControlLabel disabled control={<Switch />} label="Disabled" />
      <FormControlLabel disabled control={<Switch checked />} label="Disabled" />
    </FormGroup>
  );
};
