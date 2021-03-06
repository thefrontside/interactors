import { useCallback } from "react";
import { makeStyles, createStyles, Theme, Button } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);

export const ContainedButtons = (): JSX.Element => {
  let classes = useStyles();
  let preventDefault = useCallback((event: React.SyntheticEvent) => event.preventDefault(), []);

  return (
    <div className={classes.root}>
      <Button variant="contained">Default</Button>
      <Button variant="contained" color="primary">
        Primary
      </Button>
      <Button variant="contained" color="secondary">
        Secondary
      </Button>
      <Button variant="contained" disabled>
        Disabled
      </Button>
      <Button variant="contained" color="primary" href="#contained-buttons" onClick={preventDefault}>
        Link
      </Button>
    </div>
  );
};
