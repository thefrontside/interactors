import { useState } from "react";
import { withStyles, colors, FormGroup, FormControlLabel, Checkbox, CheckboxProps } from "@material-ui/core";
import { CheckBoxOutlineBlank, CheckBox as CheckBoxIcon, Favorite, FavoriteBorder } from "@material-ui/icons";

const GreenCheckbox = withStyles({
  root: {
    color: colors.green[400],
    "&$checked": {
      color: colors.green[600],
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export const CheckboxLabels = (): JSX.Element => {
  let [state, setState] = useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
  });

  let handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setState({ ...state, [event.target.name]: event.target.checked });

  return (
    <FormGroup row>
      <FormControlLabel
        control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
        label="Secondary"
      />
      <FormControlLabel
        control={<Checkbox checked={state.checkedB} onChange={handleChange} name="checkedB" color="primary" />}
        label="Primary"
      />
      <FormControlLabel control={<Checkbox name="checkedC" />} label="Uncontrolled" />
      <FormControlLabel disabled control={<Checkbox name="checkedD" />} label="Disabled" />
      <FormControlLabel disabled control={<Checkbox checked name="checkedE" />} label="Disabled" />
      <FormControlLabel
        control={<Checkbox checked={state.checkedF} onChange={handleChange} name="checkedF" indeterminate />}
        label="Indeterminate"
      />
      <FormControlLabel
        control={<GreenCheckbox checked={state.checkedG} onChange={handleChange} name="checkedG" />}
        label="Custom color"
      />
      <FormControlLabel
        control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} name="checkedH" />}
        label="Custom icon"
      />
      <FormControlLabel
        control={
          <Checkbox
            icon={<CheckBoxOutlineBlank fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            name="checkedI"
          />
        }
        label="Custom size"
      />
    </FormGroup>
  );
};
