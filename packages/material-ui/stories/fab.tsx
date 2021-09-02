import { createStyles, makeStyles, Theme, Fab } from "@material-ui/core";
import { Add, Edit, Favorite, Navigation } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  })
);

export const FloatingActionButtons = (): JSX.Element => {
  let classes = useStyles();

  return (
    <div className={classes.root}>
      <Fab color="primary" aria-label="add">
        <Add />
      </Fab>
      <Fab color="secondary" aria-label="edit">
        <Edit />
      </Fab>
      <Fab variant="extended">
        <Navigation className={classes.extendedIcon} />
        Navigate
      </Fab>
      <Fab disabled aria-label="like">
        <Favorite />
      </Fab>
    </div>
  );
};
