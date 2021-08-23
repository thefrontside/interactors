import { ComponentStory } from "@storybook/react";
import {
  Accordion as AccordionInteractor,
  BottomNavigation as BottomNavigationInteractor,
  Button as ButtonInteractor,
  Calendar as CalendarInteractor,
  Checkbox as CheckboxInteractor,
  DateField as DateFieldInteractor,
  DateTimeField as DateTimeFieldInteractor,
  Dialog as DialogInteractor,
  Fab as FabInteractor,
  Link as LinkInteractor,
  ListItem as ListItemInteractor,
  Menu as MenuInteractor,
  MenuItem as MenuItemInteractor,
} from "../src";
import { SimpleAccordion } from "./accordion";
import { SimpleBottomNavigation } from "./bottom-navigation";
import { ContainedButtons } from "./button";
import { StaticDatePicker } from "./calendar";
import { Checkboxes } from "./checkbox";
import { DateFields } from "./data-field";
import { DateTimeFields } from "./datatime-field";
import { FormDialog } from "./dialog";
import { FloatingActionButtons } from "./fab";
import { Links } from "./link";
import { NestedList } from "./list";
import { SimpleMenu } from "./menu";

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
  async play(): Promise<void> {
    await CheckboxInteractor("primary checkbox").click();
    await delay(500);
    await CheckboxInteractor("secondary checkbox").click();
    await delay(500);
    await CheckboxInteractor("uncontrolled-checkbox").click();
    await delay(500);
    await CheckboxInteractor("indeterminate checkbox").click();
    await delay(500);
    await CheckboxInteractor("checkbox with default color").click();
    await delay(500);
    await CheckboxInteractor("checkbox with small size").click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await CheckboxInteractor("primary checkbox").click();
await delay(500);
await CheckboxInteractor("secondary checkbox").click();
await delay(500);
await CheckboxInteractor("uncontrolled-checkbox").click();
await delay(500);
await CheckboxInteractor("indeterminate checkbox").click();
await delay(500);
await CheckboxInteractor("checkbox with default color").click();
await delay(500);
await CheckboxInteractor("checkbox with small size").click();
`,
      },
    },
  },
};

export const DateField: ComponentStory<typeof DateFields> = {
  render: () => <DateFields />,
  async play(): Promise<void> {
    await DateFieldInteractor().fillIn("1999-08-17");
  },
  parameters: {
    docs: {
      source: {
        code: 'await DateFieldInteractor().fillIn("1999-08-17");',
      },
    },
  },
};

export const DateTimeField: ComponentStory<typeof DateTimeFields> = {
  render: () => <DateTimeFields />,
  async play(): Promise<void> {
    await DateTimeFieldInteractor().fillIn("1999-08-17T13:24:35");
  },
  parameters: {
    docs: {
      source: {
        code: 'await DateTimeFieldInteractor().fillIn("1999-08-17T13:24:35");',
      },
    },
  },
};

export const Dialog: ComponentStory<typeof FormDialog> = {
  render: () => <FormDialog />,
  async play(): Promise<void> {
    await ButtonInteractor("OPEN FORM DIALOG").click();
    await delay(1000);
    await DialogInteractor().close();
  },
  parameters: {
    docs: {
      source: {
        code: `
await ButtonInteractor("OPEN FORM DIALOG").click();
await delay(1000);
await DialogInteractor().close();
`,
      },
    },
  },
};

export const Fab: ComponentStory<typeof FloatingActionButtons> = {
  render: () => <FloatingActionButtons />,
  async play(): Promise<void> {
    await FabInteractor("add").click();
    await delay(100);
    await FabInteractor("edit").click();
    await delay(100);
    await FabInteractor("NAVIGATE").click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await FabInteractor("add").click();
await delay(100);
await FabInteractor("edit").click();
await delay(100);
await FabInteractor("NAVIGATE").click();
`,
      },
    },
  },
};

export const Link: ComponentStory<typeof Links> = {
  render: () => <Links />,
  async play(): Promise<void> {
    await LinkInteractor("Link").click();
    await delay(100);
    await LinkInteractor('color="inherit"').click();
    await delay(100);
    await LinkInteractor('variant="body2"').click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await LinkInteractor("Link").click();
await delay(100);
await LinkInteractor('color="inherit"').click();
await delay(100);
await LinkInteractor('variant="body2"').click();
`,
      },
    },
  },
};

export const List: ComponentStory<typeof NestedList> = {
  render: () => <NestedList />,
  async play(): Promise<void> {
    await ListItemInteractor("Inbox").click();
    await delay(1000);
    await ListItemInteractor("Inbox").click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await ListItemInteractor('Inbox').click();
await delay(1000);
await ListItemInteractor('Inbox').click();
`,
      },
    },
  },
};

export const Menu: ComponentStory<typeof SimpleMenu> = {
  render: () => <SimpleMenu />,
  async play(): Promise<void> {
    await MenuInteractor("OPEN MENU").open();
    await delay(1000);
    await MenuItemInteractor("Profile").click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await MenuInteractor("OPEN MENU").open();
await delay(1000);
await MenuItemInteractor("Profile").click();
`
      }
    }
  }
};
