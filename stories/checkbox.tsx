import { Checkbox } from "@material-ui/core";
import { useCallback, useState } from "react";

export const Checkboxes = (): JSX.Element => {
  let [checked, setChecked] = useState(true);
  let handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setChecked(event.target.checked), []);

  return (
    <div>
      <Checkbox checked={checked} onChange={handleChange} inputProps={{ "aria-label": "primary checkbox" }} />
      <Checkbox defaultChecked color="primary" inputProps={{ "aria-label": "secondary checkbox" }} />
      <Checkbox inputProps={{ "aria-label": "uncontrolled-checkbox" }} />
      <Checkbox disabled inputProps={{ "aria-label": "disabled checkbox" }} />
      <Checkbox disabled checked inputProps={{ "aria-label": "disabled checked checkbox" }} />
      <Checkbox defaultChecked indeterminate inputProps={{ "aria-label": "indeterminate checkbox" }} />
      <Checkbox defaultChecked color="default" inputProps={{ "aria-label": "checkbox with default color" }} />
      <Checkbox defaultChecked size="small" inputProps={{ "aria-label": "checkbox with small size" }} />
    </div>
  );
};
