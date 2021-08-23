import { useCallback, useState } from "react";
import { Button, Menu, MenuItem } from "@material-ui/core";

export const SimpleMenu = (): JSX.Element => {
  let [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget), []);
  let handleClose = useCallback(() => setAnchorEl(null), []);

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Open Menu
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
};
