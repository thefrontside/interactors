import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { Accordion, matching, some } from "../src";
import {
  Accordion as Component,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Button
} from "@material-ui/core";
import { renderComponent } from "./helpers";
import { cloneElement } from "react";

export default {
  title: 'Accordion',
  component: renderComponent(Component, {}, ({ props, children }) => (
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
  ))
} as ComponentMeta<typeof Component>

const accordion = Accordion("accordion");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await accordion.exists();
    await accordion.is({ expanded: false })
    await accordion.has({ classList: some(matching(/MuiAccordion-root(-\d+)?/)) })
    await Accordion({ disabled: false }).exists()
  }
}

export const TestExpandAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await accordion.expand()
    await accordion.is({ expanded: true })
  }
}

export const TestCollapseAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await accordion.expand()
    await accordion.collapse()
    await accordion.is({ expanded: false })
  }
}

export const TestToggleAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await accordion.toggle()
    await accordion.is({ expanded: true })
    await accordion.toggle()
    await accordion.is({ expanded: false })
  }
}

export const Disabled: ComponentStoryObj<typeof Component> = {
  args: { disabled: true },
  async play() {
    await Accordion({ disabled: true }).exists()
  }
}
