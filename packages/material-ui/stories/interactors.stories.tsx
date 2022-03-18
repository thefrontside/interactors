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
  Popover as PopoverInteractor,
  Radio as RadioInteractor,
  Select as SelectInteractor,
  MultiSelect as MultiSelectInteractor,
  Slider as SliderInteractor,
  Thumb as ThumbInteractor,
  Snackbar as SnackbarInteractor,
  Switch as SwitchInteractor,
  Tabs as TabsInteractor,
  TextField as TextFieldInteractor,
  TimeField as TimeFieldInteractor,
} from "../src";
import { SimpleAccordion } from "./accordion";
import { SimpleBottomNavigation } from "./bottom-navigation";
import { ContainedButtons } from "./button";
import { StaticDatePicker } from "./calendar";
import { CheckboxLabels } from "./checkbox";
import { DateFields } from "./data-field";
import { DateTimeFields } from "./datatime-field";
import { FormDialog } from "./dialog";
import { FloatingActionButtons } from "./fab";
import { Links } from "./link";
import { NestedList } from "./list";
import { SimpleMenu } from "./menu";
import { SimplePopover } from "./popover";
import { RadioButtonsGroup } from "./radio";
import { SimpleSelect } from "./select";
import { Sliders } from "./slider";
import { SimpleSnackbar } from "./snackbar";
import { SwitchLabels } from "./switch";
import { SimpleTabs } from "./tabs";
import { BasicTextFields } from "./text-field";
import { TimePickers } from "./time-field";

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

export const Checkbox: ComponentStory<typeof CheckboxLabels> = {
  render: () => <CheckboxLabels />,
  async play(): Promise<void> {
    await CheckboxInteractor("Secondary").click();
    // await delay(500);
    await CheckboxInteractor("Primary").click();
    // await delay(500);
    await CheckboxInteractor("Uncontrolled").click();
    // await delay(500);
    await CheckboxInteractor("Indeterminate").click();
    // await delay(500);
    await CheckboxInteractor("Custom color").click();
    // await delay(500);
    await CheckboxInteractor("Custom icon").click();
    // await delay(500);
    await CheckboxInteractor("Custom size").click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await CheckboxInteractor("Secondary").click();
await delay(500);
await CheckboxInteractor("Primary").click();
await delay(500);
await CheckboxInteractor("Uncontrolled").click();
await delay(500);
await CheckboxInteractor("Indeterminate").click();
await delay(500);
await CheckboxInteractor("Custom color").click();
await delay(500);
await CheckboxInteractor("Custom icon").click();
await delay(500);
await CheckboxInteractor("Custom size").click();
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
`,
      },
    },
  },
};

export const Popover: ComponentStory<typeof SimplePopover> = {
  render: () => <SimplePopover />,
  async play(): Promise<void> {
    await ButtonInteractor("OPEN POPOVER").click();
    await delay(1000);
    await PopoverInteractor().close();
  },
  parameters: {
    docs: {
      source: {
        code: `
await ButtonInteractor("OPEN POPOVER").click();
await delay(1000);
await PopoverInteractor().close();
`,
      },
    },
  },
};

export const Radio: ComponentStory<typeof RadioButtonsGroup> = {
  render: () => <RadioButtonsGroup />,
  async play(): Promise<void> {
    await RadioInteractor("Male").choose();
    await delay(500);
    await RadioInteractor("Other").choose();
  },
  parameters: {
    docs: {
      source: {
        code: `
await RadioInteractor("Male").choose();
await delay(500);
await RadioInteractor("Other").choose();
`,
      },
    },
  },
};

export const Select: ComponentStory<typeof SimpleSelect> = {
  render: () => <SimpleSelect />,
  async play(): Promise<void> {
    await SelectInteractor("Age").choose("Ten");
    await delay(500);
    await SelectInteractor("Age").choose("Twenty");
    await delay(500);
    await SelectInteractor("Age").choose("Thirty");
    await delay(500);
    await MultiSelectInteractor("Name").select("Oliver Hansen");
    await delay(500);
    await MultiSelectInteractor("Name").select("April Tucker");
    await delay(500);
    await MultiSelectInteractor("Name").select("Omar Alexander");
    // TODO For some unknown reason options "Ralph Hubbard", "Omar Alexander" and "Carlos Abbott" aren't visible
  },
  parameters: {
    docs: {
      source: {
        code: `
await SelectInteractor("Age").choose("Ten");
await delay(500);
await SelectInteractor("Age").choose("Twenty");
await delay(500);
await SelectInteractor("Age").choose("Thirty");
await delay(500);
await MultiSelectInteractor("Name").select("Oliver Hansen");
await delay(500);
await MultiSelectInteractor("Name").select("April Tucker");
await delay(500);
await MultiSelectInteractor("Name").select("Omar Alexander");
        `,
      },
    },
  },
};

export const Slider: ComponentStory<typeof Sliders> = {
  render: () => <Sliders />,
  async play(): Promise<void> {
    await SliderInteractor("Volume").increase(10);
    await delay(500);
    await SliderInteractor("Volume").setMax();
    await delay(500);
    await SliderInteractor("Volume").decrease(25);
    await delay(500);
    await ThumbInteractor("1").increase(10);
    await delay(500);
    await ThumbInteractor("1").decrease(20);
    await delay(500);
    await ThumbInteractor("0").increase(30);
    await delay(500);
    await ThumbInteractor("0").decrease(10);
  },
  parameters: {
    docs: {
      source: {
        code: `
await SliderInteractor("Volume").increase(10);
await delay(500);
await SliderInteractor("Volume").setMax();
await delay(500);
await SliderInteractor("Volume").decrease(25);
await delay(500);
await ThumbInteractor("1").increase(10);
await delay(500);
await ThumbInteractor("1").decrease(20);
await delay(500);
await ThumbInteractor("0").increase(30);
await delay(500);
await ThumbInteractor("0").decrease(10);
`,
      },
    },
  },
};

export const Snackbar: ComponentStory<typeof SimpleSnackbar> = {
  render: () => <SimpleSnackbar />,
  async play(): Promise<void> {
    await ButtonInteractor("OPEN SIMPLE SNACKBAR").click();
    await delay(1000);
    await SnackbarInteractor().find(ButtonInteractor("UNDO")).click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await ButtonInteractor("OPEN SIMPLE SNACKBAR").click();
await delay(1000);
await SnackbarInteractor().find(ButtonInteractor('UNDO')).click();
`,
      },
    },
  },
};

export const Switch: ComponentStory<typeof SwitchLabels> = {
  render: () => <SwitchLabels />,
  async play(): Promise<void> {
    await SwitchInteractor("Secondary").toggle();
    await delay(500);
    await SwitchInteractor("Primary").toggle();
    await delay(500);
    await SwitchInteractor("Uncontrolled").toggle();
  },
  parameters: {
    docs: {
      source: {
        code: `
await SwitchInteractor("Secondary").toggle();
await delay(500);
await SwitchInteractor("Primary").toggle();
await delay(500);
await SwitchInteractor("Uncontrolled").toggle();
`,
      },
    },
  },
};

export const Tabs: ComponentStory<typeof SimpleTabs> = {
  render: () => <SimpleTabs />,
  async play(): Promise<void> {
    await TabsInteractor("simple tabs example").click("ITEM TWO");
    await delay(500);
    await TabsInteractor("simple tabs example").click("ITEM THREE");
  },
  parameters: {
    docs: {
      source: {
        code: `
await TabsInteractor("simple tabs example").click("ITEM TWO");
await delay(500);
await TabsInteractor("simple tabs example").click("ITEM THREE");
`,
      },
    },
  },
};

export const TextField: ComponentStory<typeof BasicTextFields> = {
  render: () => <BasicTextFields />,
  async play(): Promise<void> {
    await TextFieldInteractor("Standard").fillIn("Hello World");
    await delay(500);
    await TextFieldInteractor("Filled").fillIn("Hello World");
    await delay(500);
    await TextFieldInteractor("Outlined").fillIn("Hello World");
  },
  parameters: {
    docs: {
      source: {
        code: `
await TextFieldInteractor("Standard").fillIn("Hello World");
await delay(500);
await TextFieldInteractor("Filled").fillIn("Hello World");
await delay(500);
await TextFieldInteractor("Outlined").fillIn("Hello World");
`,
      },
    },
  },
};

export const TimeField: ComponentStory<typeof TimePickers> = {
  render: () => <TimePickers />,
  async play(): Promise<void> {
    await TimeFieldInteractor().fillIn("13:24:35");
  },
  parameters: {
    docs: {
      source: {
        code: 'await TimeFieldInteractor().fillIn("13:24:35");',
      },
    },
  },
};
