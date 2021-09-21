import { test } from "@bigtest/suite";
import { Link as Component } from '@material-ui/core';
import { Link, matching, some, Page } from "../src";
import { createRenderStep } from "./helpers";

const renderLink = createRenderStep(Component, { children: 'link', href: 'https://material-ui.com/components/links/' });
const link = Link("link");


export default test("Link")
  .step(Page.visit("/"))
  .step(renderLink())
  .assertion(link.exists())
  .assertion(link.has({ classList: some(matching(/MuiLink-root-\d+/)) }))
  .assertion(link.has({ href: 'https://material-ui.com/components/links/' }));
