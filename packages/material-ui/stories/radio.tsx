import { useCallback, useState } from "react";
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@material-ui/core";

export const RadioButtonsGroup = (): JSX.Element => {
  let [value, setValue] = useState("female");
  let handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setValue((event.target as HTMLInputElement).value),
    []
  );

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Gender</FormLabel>
      <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
        <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" />
      </RadioGroup>
    </FormControl>
  );
};
