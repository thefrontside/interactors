import { ComponentStory } from "@storybook/react";
import { Accordion as AccordionInteractor } from "../src";
import { SimpleAccordion } from "./accordion";
import { SimpleBottomNavigation } from "./bottom-navigation";

export default { title: "Interactors" };

export const Accordion: ComponentStory<typeof SimpleAccordion> = {
  render: SimpleAccordion,
  async play(): Promise<void> {
    await AccordionInteractor("Accordion 1").toggle();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await AccordionInteractor("Accordion 2").toggle();
  },
  parameters: {
    docs: {
      source: {
        code: `
await AccordionInteractor("Accordion 1").toggle();
await new Promise((resolve) => setTimeout(resolve, 500));
await AccordionInteractor("Accordion 2").toggle();
`,
      },
    },
  },
};
export const BottomNavigation = {
  render: SimpleBottomNavigation,
};
