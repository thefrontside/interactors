import { Page, test } from "bigtest";
import { Link as Component } from '@material-ui/core'
import { Link } from "../src";
import { createRenderStep } from "./helpers";

const renderLink = createRenderStep(Component, { children: 'link', href: 'https://material-ui.com/components/links/' });
const link = Link("link");


export default test("Link")
  .step(Page.visit("/"))
  .step(renderLink())
  .assertion(link.exists())
  .assertion(link.has({ href: 'https://material-ui.com/components/links/' }))
