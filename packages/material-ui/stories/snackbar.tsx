import { useCallback, useState } from "react";
import { Button, Snackbar, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";

export const SimpleSnackbar = (): JSX.Element => {
  let [open, setOpen] = useState(false);

  let handleClick = useCallback(() => setOpen(true), []);
  let handleClose = useCallback((_event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason !== "clickaway") setOpen(false);
  }, []);

  return (
    <div>
      <Button onClick={handleClick}>Open simple snackbar</Button>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
        action={
          <>
            <Button color="secondary" size="small" onClick={handleClose}>
              UNDO
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <Close fontSize="small" />
            </IconButton>
          </>
        }
      />
    </div>
  );
};
