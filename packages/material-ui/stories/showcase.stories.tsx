import { ComponentStoryObj } from "@storybook/react";
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
import {
  SimpleAccordion,
  SimpleBottomNavigation,
  ContainedButtons,
  StaticDatePicker,
  CheckboxLabels,
  DateFields,
  DateTimeFields,
  FormDialog,
  FloatingActionButtons,
  Links,
  NestedList,
  SimpleMenu,
  SimplePopover,
  RadioButtonsGroup,
  SimpleSelect,
  Sliders,
  SimpleSnackbar,
  SwitchLabels,
  SimpleTabs,
  BasicTextFields,
  TimePickers,
} from "./components";

export default { title: "Showcase" };

export const Accordion: ComponentStoryObj<typeof SimpleAccordion> = {
  render: () => <SimpleAccordion />,
  async play(): Promise<void> {
    await AccordionInteractor("Accordion 1").toggle();
    await AccordionInteractor("Accordion 2").toggle();
  },
  parameters: {
    docs: {
      source: {
        code: `
await AccordionInteractor("Accordion 1").toggle();
await AccordionInteractor("Accordion 2").toggle();
`,
      },
    },
  },
};
export const BottomNavigation: ComponentStoryObj<typeof SimpleBottomNavigation> = {
  render: () => <SimpleBottomNavigation />,
  async play(): Promise<void> {
    await BottomNavigationInteractor().navigate("Favorites");
    await BottomNavigationInteractor().navigate("Nearby");
  },
  parameters: {
    docs: {
      source: {
        code: `
await BottomNavigationInteractor().navigate("Favorites");
await BottomNavigationInteractor().navigate("Nearby");
`,
      },
    },
  },
};

export const Button: ComponentStoryObj<typeof ContainedButtons> = {
  render: () => <ContainedButtons />,
  async play(): Promise<void> {
    await ButtonInteractor("DEFAULT").click();
    await ButtonInteractor("PRIMARY").click();
    await ButtonInteractor("SECONDARY").click();
    await ButtonInteractor("LINK").click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await ButtonInteractor("DEFAULT").click();
await ButtonInteractor("PRIMARY").click();
await ButtonInteractor("SECONDARY").click();
await ButtonInteractor("LINK").click();
`,
      },
    },
  },
};

export const Calendar: ComponentStoryObj<typeof StaticDatePicker> = {
  render: () => <StaticDatePicker />,
  async play(): Promise<void> {
    await CalendarInteractor().nextMonth();
    await CalendarInteractor().prevMonth();
    await CalendarInteractor().prevMonth();
    await CalendarInteractor().setDay(23);
  },
  parameters: {
    docs: {
      source: {
        code: `
await CalendarInteractor().nextMonth();
await CalendarInteractor().prevMonth();
await CalendarInteractor().prevMonth();
await CalendarInteractor().setDay(23);
`,
      },
    },
  },
};

export const Checkbox: ComponentStoryObj<typeof CheckboxLabels> = {
  render: () => <CheckboxLabels />,
  async play(): Promise<void> {
    await CheckboxInteractor("Secondary").click();
    await CheckboxInteractor("Primary").click();
    await CheckboxInteractor("Uncontrolled").click();
    await CheckboxInteractor("Indeterminate").click();
    await CheckboxInteractor("Custom color").click();
    await CheckboxInteractor("Custom icon").click();
    await CheckboxInteractor("Custom size").click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await CheckboxInteractor("Secondary").click();
await CheckboxInteractor("Primary").click();
await CheckboxInteractor("Uncontrolled").click();
await CheckboxInteractor("Indeterminate").click();
await CheckboxInteractor("Custom color").click();
await CheckboxInteractor("Custom icon").click();
await CheckboxInteractor("Custom size").click();
`,
      },
    },
  },
};

export const DateField: ComponentStoryObj<typeof DateFields> = {
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

export const DateTimeField: ComponentStoryObj<typeof DateTimeFields> = {
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

export const Dialog: ComponentStoryObj<typeof FormDialog> = {
  render: () => <FormDialog />,
  async play(): Promise<void> {
    await ButtonInteractor("OPEN FORM DIALOG").click();
    await DialogInteractor().close();
  },
  parameters: {
    docs: {
      source: {
        code: `
await ButtonInteractor("OPEN FORM DIALOG").click();
await DialogInteractor().close();
`,
      },
    },
  },
};

export const Fab: ComponentStoryObj<typeof FloatingActionButtons> = {
  render: () => <FloatingActionButtons />,
  async play(): Promise<void> {
    await FabInteractor("add").click();
    await FabInteractor("edit").click();
    await FabInteractor("NAVIGATE").click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await FabInteractor("add").click();
await FabInteractor("edit").click();
await FabInteractor("NAVIGATE").click();
`,
      },
    },
  },
};

export const Link: ComponentStoryObj<typeof Links> = {
  render: () => <Links />,
  async play(): Promise<void> {
    await LinkInteractor("Link").click();
    await LinkInteractor('color="inherit"').click();
    await LinkInteractor('variant="body2"').click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await LinkInteractor("Link").click();
await LinkInteractor('color="inherit"').click();
await LinkInteractor('variant="body2"').click();
`,
      },
    },
  },
};

export const List: ComponentStoryObj<typeof NestedList> = {
  render: () => <NestedList />,
  async play(): Promise<void> {
    await ListItemInteractor("Inbox").click();
    await ListItemInteractor("Inbox").click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await ListItemInteractor('Inbox').click();
await ListItemInteractor('Inbox').click();
`,
      },
    },
  },
};

export const Menu: ComponentStoryObj<typeof SimpleMenu> = {
  render: () => <SimpleMenu />,
  async play(): Promise<void> {
    await MenuInteractor("OPEN MENU").open();
    await MenuItemInteractor("Profile").click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await MenuInteractor("OPEN MENU").open();
await MenuItemInteractor("Profile").click();
`,
      },
    },
  },
};

export const Popover: ComponentStoryObj<typeof SimplePopover> = {
  render: () => <SimplePopover />,
  async play(): Promise<void> {
    await ButtonInteractor("OPEN POPOVER").click();
    await PopoverInteractor().close();
  },
  parameters: {
    docs: {
      source: {
        code: `
await ButtonInteractor("OPEN POPOVER").click();
await PopoverInteractor().close();
`,
      },
    },
  },
};

export const Radio: ComponentStoryObj<typeof RadioButtonsGroup> = {
  render: () => <RadioButtonsGroup />,
  async play(): Promise<void> {
    await RadioInteractor("Male").choose();
    await RadioInteractor("Other").choose();
  },
  parameters: {
    docs: {
      source: {
        code: `
await RadioInteractor("Male").choose();
await RadioInteractor("Other").choose();
`,
      },
    },
  },
};

export const Select: ComponentStoryObj<typeof SimpleSelect> = {
  render: () => <SimpleSelect />,
  async play(): Promise<void> {
    await SelectInteractor("Age").choose("Ten");
    await SelectInteractor("Age").choose("Twenty");
    await SelectInteractor("Age").choose("Thirty");
    await MultiSelectInteractor("Name").select("Oliver Hansen");
    await MultiSelectInteractor("Name").select("April Tucker");
    await MultiSelectInteractor("Name").select("Omar Alexander");
    // TODO For some unknown reason options "Ralph Hubbard", "Omar Alexander" and "Carlos Abbott" aren't visible
  },
  parameters: {
    docs: {
      source: {
        code: `
await SelectInteractor("Age").choose("Ten");
await SelectInteractor("Age").choose("Twenty");
await SelectInteractor("Age").choose("Thirty");
await MultiSelectInteractor("Name").select("Oliver Hansen");
await MultiSelectInteractor("Name").select("April Tucker");
await MultiSelectInteractor("Name").select("Omar Alexander");
        `,
      },
    },
  },
};

export const Slider: ComponentStoryObj<typeof Sliders> = {
  render: () => <Sliders />,
  async play(): Promise<void> {
    await SliderInteractor("Volume").increase(10);
    await SliderInteractor("Volume").setMax();
    await SliderInteractor("Volume").decrease(25);
    await ThumbInteractor("1").increase(10);
    await ThumbInteractor("1").decrease(20);
    await ThumbInteractor("0").increase(30);
    await ThumbInteractor("0").decrease(10);
  },
  parameters: {
    docs: {
      source: {
        code: `
await SliderInteractor("Volume").increase(10);
await SliderInteractor("Volume").setMax();
await SliderInteractor("Volume").decrease(25);
await ThumbInteractor("1").increase(10);
await ThumbInteractor("1").decrease(20);
await ThumbInteractor("0").increase(30);
await ThumbInteractor("0").decrease(10);
`,
      },
    },
  },
};

export const Snackbar: ComponentStoryObj<typeof SimpleSnackbar> = {
  render: () => <SimpleSnackbar />,
  async play(): Promise<void> {
    await ButtonInteractor("OPEN SIMPLE SNACKBAR").click();
    await SnackbarInteractor().find(ButtonInteractor("UNDO")).click();
  },
  parameters: {
    docs: {
      source: {
        code: `
await ButtonInteractor("OPEN SIMPLE SNACKBAR").click();
await SnackbarInteractor().find(ButtonInteractor('UNDO')).click();
`,
      },
    },
  },
};

export const Switch: ComponentStoryObj<typeof SwitchLabels> = {
  render: () => <SwitchLabels />,
  async play(): Promise<void> {
    await SwitchInteractor("Secondary").toggle();
    await SwitchInteractor("Primary").toggle();
    await SwitchInteractor("Uncontrolled").toggle();
  },
  parameters: {
    docs: {
      source: {
        code: `
await SwitchInteractor("Secondary").toggle();
await SwitchInteractor("Primary").toggle();
await SwitchInteractor("Uncontrolled").toggle();
`,
      },
    },
  },
};

export const Tabs: ComponentStoryObj<typeof SimpleTabs> = {
  render: () => <SimpleTabs />,
  async play(): Promise<void> {
    await TabsInteractor("simple tabs example").click("ITEM TWO");
    await TabsInteractor("simple tabs example").click("ITEM THREE");
  },
  parameters: {
    docs: {
      source: {
        code: `
await TabsInteractor("simple tabs example").click("ITEM TWO");
await TabsInteractor("simple tabs example").click("ITEM THREE");
`,
      },
    },
  },
};

export const TextField: ComponentStoryObj<typeof BasicTextFields> = {
  render: () => <BasicTextFields />,
  async play(): Promise<void> {
    await TextFieldInteractor("Standard").fillIn("Hello World");
    await TextFieldInteractor("Filled").fillIn("Hello World");
    await TextFieldInteractor("Outlined").fillIn("Hello World");
  },
  parameters: {
    docs: {
      source: {
        code: `
await TextFieldInteractor("Standard").fillIn("Hello World");
await TextFieldInteractor("Filled").fillIn("Hello World");
await TextFieldInteractor("Outlined").fillIn("Hello World");
`,
      },
    },
  },
};

export const TimeField: ComponentStoryObj<typeof TimePickers> = {
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
