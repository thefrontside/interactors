import { test } from "@bigtest/suite";
import { Fab, including, Page, HTML, some, matching } from "../src";
import { Fab as Component, Icon } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { createRenderStep } from "./helpers";

const renderFab = createRenderStep(Component, { children: 'My Fab' });
const fab = Fab('My Fab'.toUpperCase());

const Span = HTML.selector("span");

export default test("Fab")
  .step(Page.visit("/"))
  .child("can render a floating action button", (test) =>
    test
      .step(renderFab())
      .assertion(fab.exists())
      .assertion(fab.has({ classList: some(matching(/MuiFab-root-\d+/)) }))
      .assertion(fab.has({ text: "My Fab".toUpperCase() }))
  )
  .child("renders extended floating action button", (test) =>
    test
      .step(renderFab({ variant: "extended" }))
      .assertion(fab.has({ className: including("MuiFab-extended") }))
  )
  .child("render Icon with children with right classes", (test) =>
    test
      .step(renderFab({ children: <Icon data-testid="icon" className={"child-woof"} /> }))
      .assertion(Fab().find(Span({ className: including("child-woof") })).exists())
  )
  .child("render Fab with only icon and aria-label", (test) =>
    test
      .step(renderFab({ color: 'primary', 'aria-label': "add", children: <Add /> }))
      .assertion(Fab('add').has({ svgIcon: true }))
  );
