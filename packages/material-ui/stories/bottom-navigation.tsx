import { useState } from "react";
import { BottomNavigation, BottomNavigationAction, makeStyles } from "@material-ui/core";
import { Favorite, LocationOn, Restore } from "@material-ui/icons";

const useStyles = makeStyles({
  root: {
    width: 500,
  },
});

export const SimpleBottomNavigation = (): JSX.Element => {
  let classes = useStyles();
  let [value, setValue] = useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Recents" icon={<Restore />} />
      <BottomNavigationAction label="Favorites" icon={<Favorite />} />
      <BottomNavigationAction label="Nearby" icon={<LocationOn />} />
    </BottomNavigation>
  );
};
