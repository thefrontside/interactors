import { test } from "@bigtest/suite";
import { Radio as Interactor, Page } from "../src";
import { Radio as MuiRadio } from "@material-ui/core";
import { createRenderStep } from "./helpers";

const radio = Interactor();
const renderRadioButton = createRenderStep(MuiRadio);

export default test("Radio")
  .step(Page.visit("/"))
  .child("can render radio button", (test) => test
    .step(renderRadioButton())
    .assertion(radio.exists())
    .assertion(radio.is({ checked: false }))
  );
