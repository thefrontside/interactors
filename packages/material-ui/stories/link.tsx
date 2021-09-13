import { useCallback } from "react";
import { makeStyles, createStyles, Theme, Link, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
  })
);

export const Links = (): JSX.Element => {
  let classes = useStyles();
  let preventDefault = useCallback((event: React.SyntheticEvent) => event.preventDefault(), []);

  return (
    <Typography className={classes.root}>
      <Link href="#" onClick={preventDefault}>
        Link
      </Link>
      <Link href="#" onClick={preventDefault} color="inherit">
        {'color="inherit"'}
      </Link>
      <Link href="#" onClick={preventDefault} variant="body2">
        {'variant="body2"'}
      </Link>
    </Typography>
  );
};
