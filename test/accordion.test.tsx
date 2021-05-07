import { test, Page } from "bigtest";
import { Accordion } from "../src/index";
import {
  Accordion as Component,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Button
} from "@material-ui/core";
import { createRenderStep } from "./helpers";
import { cloneElement } from "react";

const renderAccordion = createRenderStep(Component, {}, ({ props, children }) => (
  cloneElement(
    children(props),
    {},
    <AccordionSummary aria-label="accordion">Expand</AccordionSummary>,
    <AccordionDetails>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
    </AccordionDetails>,
    <AccordionActions>
      <Button>Ok</Button>
    </AccordionActions>
  )
));
const accordion = Accordion("accordion");

export default test("Accordion")
  .step(Page.visit("/"))
  .child('default render', (test) =>
    test
      .step(renderAccordion())
      .assertion(accordion.exists())
      .assertion(accordion.is({ expanded: false }))
      .assertion(Accordion({ disabled: false }).exists())
      .child('test `expand` action', (test) =>
        test
          .step(accordion.expand())
          .assertion(accordion.is({ expanded: true }))
      )
      .child('test `collapse` action', (test) =>
        test
          .step(accordion.expand())
          .step(accordion.collapse())
          .assertion(accordion.is({ expanded: false }))
      )
      .child('test `toggle` action', (test) =>
        test
          .step(accordion.toggle())
          .assertion(accordion.is({ expanded: true }))
          .child('toggle 2nd time', (test) =>
            test
              .step(accordion.toggle())
              .assertion(accordion.is({ expanded: false }))
          )
      )
  )
  .child('disabled={true}', (test) =>
    test
      .step(renderAccordion({ disabled: true }))
      .assertion(Accordion({ disabled: true }).exists())
  )
