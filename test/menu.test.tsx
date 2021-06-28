import { test, Page, HTML } from "bigtest";
import { matching, Menu, MenuItem, MenuList, some } from "../src/index";
import { Menu as Component, Button, MenuItem as ComponentItem } from "@material-ui/core";
import { createRenderStep } from "./helpers";
import { cloneElement, MouseEvent, useState } from "react";

const renderMenu = createRenderStep(Component, { id: 'menu-id' }, ({ props, children }) => {
  let [menuItem, setMenuItem] = useState('Empty');
  let [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  let handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  let handleClose = (event: MouseEvent<HTMLLIElement>) => {
    setMenuItem(event.currentTarget.innerText);
    setAnchorEl(null);
  };

  return (
    <>
      <span id="menu-item">{menuItem}</span>
      <Button aria-controls="menu-id" aria-haspopup="true" onClick={handleClick}>
        Open Menu
      </Button>
      {cloneElement(
        children(props),
        { open: Boolean(anchorEl), anchorEl, onClose: handleClose },
        <ComponentItem onClick={handleClose}>Profile</ComponentItem>,
        <ComponentItem onClick={handleClose}>My account</ComponentItem>,
        <ComponentItem onClick={handleClose}>Logout</ComponentItem>
      )}
    </>
  );
});
const menu = Menu("OPEN MENU");

export default test("Menu")
  .step(Page.visit("/"))
  .step(renderMenu())
  .assertion(menu.exists())
  .assertion(HTML({ id: 'menu-item' }).has({ text: 'Empty' }))
  .child('test `open` action', (test) =>
    test
      .step(menu.open())
      .assertion(MenuList('menu-id').find(MenuItem('Logout')).exists())
      .assertion(MenuList('menu-id').find(MenuItem('Logout')).has({ classList: some(matching(/MuiMenuItem-root-\d+/)) }))
  )
  .child('test `click` action', (test) =>
    test
      .step(menu.click('Profile'))
      .assertion(HTML({ id: 'menu-item' }).has({ text: 'Profile' }))
  );
