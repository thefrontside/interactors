import { test, Page} from "bigtest";
import { Button as Interactor, not } from "../src/index";
import { Button as MuiButton } from "@material-ui/core";
import { render } from "./helpers";

const button = Interactor();

export default test("Button")
 .step(Page.visit("/"))
 .child("rendering a button", (test) => test
   .step("render button", async() => {
     await render(<MuiButton>My Button</MuiButton>)
   })
   .assertion(button.exists())
   .assertion(button.has({ text: "My Button".toUpperCase()}))
   .assertion("it should render with the root, text and textPrimary classes but no others", async() => {
   await button.has({ classList: ['MuiButtonBase-root', 'MuiButton-root', 'MuiButton-text']})
   await button.has({ classList: not(['Mui-textSecondary', 'Mui-outlined', 'Mui-contained'])})
   })
 )
 .child('render a text seconday button', (test) => test
   .step("render secondary button",async() =>{
     await render(<MuiButton color="secondary">Secondary Button</MuiButton>)
   })
   .assertion(button.exists())
 )
