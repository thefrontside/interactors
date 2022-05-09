import { matching, Menu, MenuItem, MenuList, some, HTML } from "../src";
import { Menu as Component, Button, MenuItem as ComponentItem } from "@material-ui/core";
import { renderComponent } from "./helpers";
import { cloneElement, MouseEvent, useState } from "react";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "Menu",
  component: renderComponent(Component, { id: "menu-id" }, ({ props, children }) => {
    let [menuItem, setMenuItem] = useState("Empty");
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
  }),
} as ComponentMeta<typeof Component>;

const menu = Menu("OPEN MENU");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await menu.exists();
    await HTML({ id: "menu-item" }).has({ text: "Empty" });
  },
};

export const OpenAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await menu.open();
    await MenuList("menu-id").find(MenuItem("Logout")).exists();
    await MenuList("menu-id")
      .find(MenuItem("Logout"))
      .has({ classList: some(matching(/MuiMenuItem-root(-\d+)?/)) });
  },
};

export const ClickAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await menu.click("Profile");
    await HTML({ id: "menu-item" }).has({ text: "Profile" });
  },
};
