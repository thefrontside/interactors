import { cloneElement, useState } from "react";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { Restore, Favorite, LocationOn } from "@material-ui/icons";
import { BottomNavigation as Component, BottomNavigationAction } from "@material-ui/core";
import { BottomNavigation } from "../src";
import { renderComponent } from "./helpers";

export default {
  title: "BottomNavigation",
  component: renderComponent(Component, {}, ({ props, children }) => {
    let [value, setValue] = useState(0);

    return cloneElement(
      children(props),
      { value, onChange: (_: unknown, newValue: number) => setValue(newValue) },
      ...[
        <BottomNavigationAction label="Recents" icon={<Restore />} />,
        <BottomNavigationAction label="Favorites" icon={<Favorite />} />,
        <BottomNavigationAction label="Nearby" icon={<LocationOn />} />,
      ]
    );
  }),
} as ComponentMeta<typeof Component>;

const bottomNavigation = BottomNavigation();

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await bottomNavigation.has({ value: "Recents" });
  },
};

export const NavigateAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await bottomNavigation.navigate("Favorites");
    await bottomNavigation.has({ value: "Favorites" });
  },
};
