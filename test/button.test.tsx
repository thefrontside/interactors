import { test, Page} from "bigtest";
import { Button as btButton } from "../src/index";
import { Button as MyButton } from "@material-ui/core";
import { render } from "./helpers";

export default test("Button")
 .step(Page.visit("/"))
 .step("rendering a button", async() => {
   render(<MyButton>Click me</MyButton>)
 })
 .assertion(btButton("Click me").exists())