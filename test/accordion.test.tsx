import { test, Page } from "bigtest";
import { Accordion, AccordionDetails, AccordionActions } from "../src/index";
import {
  Accordion as Component,
  AccordionSummary as ComponentSummary,
  AccordionDetails as ComponentDetails,
  AccordionActions as ComponentActions,
  Button
} from "@material-ui/core";
import { createRenderStep } from "./helpers";
import { cloneElement } from "react";

const renderAccordion = createRenderStep(Component, {}, ({ props, children }) => (
  cloneElement(
    children(props),
    {},
    <ComponentSummary aria-label="accordion">Expand</ComponentSummary>,
    <ComponentDetails>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
    </ComponentDetails>,
    <ComponentActions>
      <Button>Ok</Button>
    </ComponentActions>
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
      .assertion(accordion.find(AccordionDetails()).absent())
      .assertion(accordion.find(AccordionActions()).absent())
      .assertion(accordion.find(AccordionDetails({ visible: false })).exists())
      .assertion(accordion.find(AccordionActions({ visible: false })).exists())
      .child('test `expand` action', (test) =>
        test
          .step(accordion.expand())
          .assertion(accordion.is({ expanded: true }))
          .assertion(accordion.find(AccordionDetails()).exists())
          .assertion(accordion.find(AccordionActions()).exists())
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
