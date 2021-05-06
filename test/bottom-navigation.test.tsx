import { cloneElement, useState } from "react";
import { test, Page } from "bigtest";
import { BottomNavigation } from '../src'
import { BottomNavigation as Component, BottomNavigationAction } from '@material-ui/core'
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { createRenderStep } from "./helpers";

const renderBottomNavigation = createRenderStep(Component, {}, ({ props, children }) => {
  const [value, setValue] = useState(0);

  return cloneElement(
    children(props),
    { value, onChange: (_: any, newValue: number) => setValue(newValue) },
    ...[
      <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />,
      <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />,
      <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />,
    ]
  );
})
const bottomNavigation = BottomNavigation()

export default test('BottomNavigation')
  .step(Page.visit('/'))
  .step(renderBottomNavigation())
  .assertion(bottomNavigation.has({ value: 'Recents'}))
  .child('test `choose` action', (test) =>
    test
      .step(bottomNavigation.navigate('Favorites'))
      .assertion(bottomNavigation.has({ value: 'Favorites'}))
  )
