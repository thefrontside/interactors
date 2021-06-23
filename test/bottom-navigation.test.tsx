import { cloneElement, useState } from "react";
import { test, Page } from "bigtest";
import { BottomNavigation } from '../src'
import { BottomNavigation as Component, BottomNavigationAction } from '@material-ui/core'
import { Restore, Favorite, LocationOn } from '@material-ui/icons';
import { createRenderStep } from "./helpers";

const renderBottomNavigation = createRenderStep(Component, {}, ({ props, children }) => {
  const [value, setValue] = useState(0);

  return cloneElement(
    children(props),
    { value, onChange: (_: any, newValue: number) => setValue(newValue) },
    ...[
      <BottomNavigationAction label="Recents" icon={<Restore />} />,
      <BottomNavigationAction label="Favorites" icon={<Favorite />} />,
      <BottomNavigationAction label="Nearby" icon={<LocationOn />} />,
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
