import { useCallback, useState } from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
  Input,
  useTheme,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

export const SimpleSelect = (): JSX.Element => {
  let classes = useStyles();
  let theme = useTheme();
  let [age, setAge] = useState("");
  let [personName, setPersonName] = useState<string[]>([]);
  let handleChangeMultiple = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => setPersonName(event.target.value as string[]),
    []
  );
  let handleChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => setAge(event.target.value as string),
    []
  );

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={age} onChange={handleChange}>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Some important helper text</FormHelperText>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-name-label">Name</InputLabel>
        <Select
          labelId="demo-mutiple-name-label"
          id="demo-mutiple-name"
          multiple
          value={personName}
          onChange={handleChangeMultiple}
          input={<Input />}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
