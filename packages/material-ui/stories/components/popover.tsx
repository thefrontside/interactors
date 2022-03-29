import { useCallback, useState } from "react";
import { makeStyles, createStyles, Theme, Popover, Typography, Button, PopoverOrigin } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
  })
);

const anchorOrigin: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "center",
};

const transformOrigin: PopoverOrigin = {
  vertical: "top",
  horizontal: "center",
};

export const SimplePopover = (): JSX.Element => {
  let classes = useStyles();
  let [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  let handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget), []);
  let handleClose = useCallback(() => setAnchorEl(null), []);

  let open = Boolean(anchorEl);
  let id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
        Open Popover
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        <Typography className={classes.typography}>The content of the Popover.</Typography>
      </Popover>
    </div>
  );
};
