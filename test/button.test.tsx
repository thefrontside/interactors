import { test, Page } from "bigtest";
import { Button as btButton } from "../src/index";
import { Button as MyButton } from "@material-ui/core";
import { renderStep } from "./helpers";

export default test("Button")
  .step(Page.visit("/"))
  .step(renderStep(<MyButton>Click me</MyButton>))
  .assertion(btButton("CLICK ME").exists());
