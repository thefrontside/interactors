import { ComponentStory } from "@storybook/react";
import {
  Accordion as AccordionInteractor,
  BottomNavigation as BottomNavigationInteractor,
  Button as ButtonInteractor,
  Calendar as CalendarInteractor,
} from "../src";
import { SimpleAccordion } from "./accordion";
import { SimpleBottomNavigation } from "./bottom-navigation";
import { ContainedButtons } from "./button";
import { StaticDatePicker } from "./calendar";
import { Checkboxes } from "./checkbox";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default { title: "Interactors" };

export const Accordion: ComponentStory<typeof SimpleAccordion> = {
  render: () => <SimpleAccordion />,
  async play(): Promise<void> {
    await AccordionInteractor("Accordion 1").toggle();
    await delay(500);
    await AccordionInteractor("Accordion 2").toggle();
  },
  parameters: {
    docs: {
      source: {
        code: `
await AccordionInteractor("Accordion 1").toggle();
await delay(500);
await AccordionInteractor("Accordion 2").toggle();
`,
      },
    },
  },
};
export const BottomNavigation: ComponentStory<typeof SimpleBottomNavigation> = {
  render: () => <SimpleBottomNavigation />,
  async play(): Promise<void> {
    await BottomNavigationInteractor().navigate("Favorites");
    await delay(500);
    await BottomNavigationInteractor().navigate("Nearby");
  },
  parameters: {
    docs: {
      source: {
        code: `
await BottomNavigationInteractor().navigate("Favorites");
await delay(500);
await BottomNavigationInteractor().navigate("Nearby");
`,
      },
    },
  },
};

// TODO Show clicks somehow
export const Button: ComponentStory<typeof ContainedButtons> = {
  render: () => <ContainedButtons />,
  async play(): Promise<void> {
    await ButtonInteractor("DEFAULT").click();
    await delay(100);
    await ButtonInteractor("PRIMARY").click();
    await delay(100);
    await ButtonInteractor("SECONDARY").click();
    await delay(100);
    await ButtonInteractor("LINK").click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await ButtonInteractor("DEFAULT").click();
await delay(100);
await ButtonInteractor("PRIMARY").click();
await delay(100);
await ButtonInteractor("SECONDARY").click();
await delay(100);
await ButtonInteractor("LINK").click();
`,
      },
    },
  },
};

export const Calendar: ComponentStory<typeof StaticDatePicker> = {
  render: () => <StaticDatePicker />,
  async play(): Promise<void> {
    await CalendarInteractor().nextMonth();
    await delay(500);
    await CalendarInteractor().prevMonth();
    await delay(500);
    await CalendarInteractor().prevMonth();
    await delay(500);
    await CalendarInteractor().setDay(23);
  },
  parameters: {
    docs: {
      source: {
        code: `
await CalendarInteractor().nextMonth();
await delay(500);
await CalendarInteractor().prevMonth();
await delay(500);
await CalendarInteractor().prevMonth();
await delay(500);
await CalendarInteractor().setDay(23);
        `,
      },
    },
  },
};

export const Checkbox: ComponentStory<typeof Checkboxes> = {
  render: () => <Checkboxes />,
};
