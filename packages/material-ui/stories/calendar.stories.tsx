import { Calendar as Component } from "@material-ui/pickers";
import { Calendar, createCalendar } from "../src";
import { renderPickerComponent } from "./helpers";
import DateFnsUtils from "@date-io/date-fns";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  title: "Calendar",
  component: renderPickerComponent(Component),
} as ComponentMeta<typeof Component>;

const CalendarWithUtils = createCalendar(new DateFnsUtils());
const calendar = Calendar("18 August 2014");

export const Default: ComponentStoryObj<typeof Component> = {
  async play() {
    await calendar.exists();
    await calendar.has({ title: "August 2014" });
    await calendar.has({ month: "August" });
    await calendar.has({ year: 2014 });
    await calendar.has({ day: 18 });
    await calendar.has({ weekDay: "Mo" });
    await CalendarWithUtils({ date: new Date("2014-08-18T00:00:00.000Z") }).exists();
  },
};

export const NextMonthAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await calendar.nextMonth();
    await Calendar().has({ title: "September 2014" });
  },
};

export const PrevMonthAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await calendar.prevMonth();
    await Calendar().has({ title: "July 2014" });
  },
};

export const SetYearActionFuture: ComponentStoryObj<typeof Component> = {
  async play() {
    // NOTE: Using here `Calendar("18 August 2014")` leads to issue where the second nextMonth step throws NoSuchElementError
    await Calendar().setYear(2015);
    await Calendar().has({ title: "August 2015" });
  },
};

export const SetYearActionPast: ComponentStoryObj<typeof Component> = {
  async play() {
    await Calendar().setYear(2013);
    await Calendar().has({ title: "August 2013" });
  },
};

export const SetMonthActionFuture: ComponentStoryObj<typeof Component> = {
  async play() {
    await Calendar().setMonth("September");
    await Calendar().has({ title: "September 2014" });
  },
};

export const SetMonthActionPast: ComponentStoryObj<typeof Component> = {
  async play() {
    await Calendar().setMonth("July");
    await Calendar().has({ title: "July 2014" });
  },
};

export const SetMonthActionFutureWithUtils: ComponentStoryObj<typeof Component> = {
  async play() {
    await CalendarWithUtils().setMonth("September");
    await Calendar().has({ title: "September 2014" });
  },
};

export const SetMonthActionPastWithUtils: ComponentStoryObj<typeof Component> = {
  async play() {
    await CalendarWithUtils().setMonth("July");
    await Calendar().has({ title: "July 2014" });
  },
};

export const SetDayAction: ComponentStoryObj<typeof Component> = {
  async play() {
    await calendar.setDay(15);
    await Calendar("15 August 2014").exists();
  },
};

export const SetDayActionCustomDayRender: ComponentStoryObj<typeof Component> = {
  args: {
    renderDay: (day, _selectedDate, dayInCurrentMonth) => <button hidden={!dayInCurrentMonth}>{day?.getDate()}</button>,
  },
  async play() {
    await Calendar().setDay(20);
    // NOTE There is no way to filter by selected day with a fully custom day render
    // But we still be able do day clicks, just can't test it ¯\_(ツ)_/¯
    await Calendar("August 2014").exists();
  },
};

export const NextMonthActionCustomIcon: ComponentStoryObj<typeof Component> = {
  args: { rightArrowIcon: <span /> },
  async play() {
    await calendar.nextMonth();
    await Calendar().has({ title: "September 2014" });
  },
};

export const PrevMonthActionCustomIcon: ComponentStoryObj<typeof Component> = {
  args: { leftArrowIcon: <span /> },
  async play() {
    await calendar.prevMonth();
    await Calendar().has({ title: "July 2014" });
  },
};
