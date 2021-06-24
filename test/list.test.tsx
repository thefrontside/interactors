import { test, Page } from "bigtest";
import { List, ListItem } from "../src/index";
import { List as Component, ListItem as ComponentItem } from "@material-ui/core";
import { createRenderStep } from "./helpers";
import { cloneElement } from "react";

const renderList = createRenderStep(Component, { 'aria-label': 'Three items list' }, ({ props, children }) => {
  return (
    cloneElement(
        children(props),
        { },
        <ComponentItem>One</ComponentItem>,
        <ComponentItem>Two</ComponentItem>,
        <ComponentItem disabled>Three</ComponentItem>,
      )
  )
});
const list = List("Three items list");

export default test("List")
  .step(Page.visit("/"))
  .step(renderList())
  .assertion(list.exists())
  .assertion(list.find(ListItem('One')).exists())
  .assertion(list.find(ListItem('Three', { disabled: true })).exists())
  .assertion(list.find(ListItem('Two')).is({ index: 1 }))
