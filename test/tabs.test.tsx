import { test, Page } from "bigtest";
import { Tab, Tabs } from "../src/index";
import { Tabs as Component, Tab as TabComponent } from "@material-ui/core";
import { createRenderStep } from "./helpers";
import { ChangeEvent, cloneElement, useState } from "react";

const renderTabs = createRenderStep(Component, {
  'aria-label': 'tabs'
}, ({ props, children }) => {
  const [value, setValue] = useState(2);

  const handleChange = (_event: ChangeEvent<{}>, newValue: number) => setValue(newValue);

  return cloneElement(
    children(props),
    { value, onChange: handleChange },
    <TabComponent label="One" />,
    <TabComponent label="Two" disabled />,
    <TabComponent label="Three" />,
  );
});
const tabs = Tabs("tabs");

export default test("Tabs")
  .step(Page.visit("/"))
  .step(renderTabs())
  .assertion(tabs.exists())
  .assertion(tabs.has({ value: 'THREE' }))
  .assertion(tabs.find(Tab({ disabled: true })).exists())
  .child('test `click` action', (test) =>
    test
      .step(tabs.click('ONE'))
      .assertion(tabs.has({ value: 'ONE' }))
  )
