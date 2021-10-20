import { test } from "bigtest";
import { matching, some, Tab, Tabs, Page } from "../src";
import { Tabs as Component, Tab as TabComponent } from "@material-ui/core";
import { createRenderStep } from "./helpers";
import { cloneElement, useState } from "react";

const renderTabs = createRenderStep(Component, {
  'aria-label': 'tabs'
}, ({ props, children }) => {
  let [value, setValue] = useState(2);

  let handleChange = (_event: unknown, newValue: number) => setValue(newValue);

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
  .assertion(tabs.has({ classList: some(matching(/MuiTabs-root-\d+/)) }))
  .assertion(tabs.find(Tab({ disabled: true })).exists())
  .child('test `click` action', (test) =>
    test
      .step(tabs.click('ONE'))
      .assertion(tabs.has({ value: 'ONE' }))
  );
