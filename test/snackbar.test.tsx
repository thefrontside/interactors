import { test, Page } from "bigtest";
import { Snackbar } from "../src/index";
import { Snackbar as Component } from "@material-ui/core";
import { createRenderStep } from "./helpers";

const renderSnackbar = createRenderStep(Component, { message: 'Snackbar', open: true });
const snackbar = Snackbar("Snackbar");

export default test("Snackbar")
  .step(Page.visit("/"))
  .step(renderSnackbar())
  .assertion(snackbar.exists())
