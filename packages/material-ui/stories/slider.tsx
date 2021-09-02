import { useCallback, useState } from "react";
import { makeStyles, Typography, Slider } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

function valuetext(value: number) {
  return `${value}°C`;
}

function label(index: number) {
  return String(index);
}

export const Sliders = (): JSX.Element => {
  let classes = useStyles();
  let [range, setRange] = useState<number[]>([20, 37]);
  let [value, setValue] = useState<number>(30);

  let handleChange = useCallback((_event: unknown, newValue: number | number[]) => setValue(newValue as number), []);
  let handleRangeChange = useCallback(
    (_event: unknown, newValue: number | number[]) => setRange(newValue as number[]),
    []
  );

  return (
    <div className={classes.root}>
      <Typography id="continuous-slider" gutterBottom>
        Volume
      </Typography>
      <Slider value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
      <Typography id="range-slider" gutterBottom>
        Temperature range
      </Typography>
      <Slider
        value={range}
        onChange={handleRangeChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
        getAriaLabel={label}
      />
    </div>
  );
};
