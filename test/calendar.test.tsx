import { test, Page } from "bigtest";
import { Calendar as Component } from "@material-ui/pickers";
import { Calendar, createCalendar } from "../src";
import { createPickerRenderStep } from "./helpers";
import DateFnsUtils from "@date-io/date-fns";

const renderComponent = createPickerRenderStep(Component);
const CalendarWithUtils = createCalendar(new DateFnsUtils());
const calendar = Calendar("18 August 2014");

export default test("Calendar")
  .step(Page.visit("/"))
  .child("default render", (test) =>
    test
      .step(renderComponent())
      .assertion(calendar.exists())
      .assertion(calendar.has({ title: "August 2014" }))
      .assertion(calendar.has({ month: "August" }))
      .assertion(calendar.has({ year: "2014" }))
      .assertion(calendar.has({ day: 18 }))
      .assertion(calendar.has({ weekDay: "Mo" }))
      .assertion(CalendarWithUtils({ date: new Date("2014-08-18T00:00:00.000Z") }).exists())
      .child("nextMonth action", (test) =>
        test.step(calendar.nextMonth()).assertion(Calendar().has({ title: "September 2014" }))
      )
      .child("prevMonth action", (test) =>
        test.step(calendar.prevMonth()).assertion(Calendar().has({ title: "July 2014" }))
      )
      // NOTE: Using here `Calendar("18 August 2014")` leads to issue where the second nextMonth step throws NoSuchElementError
      .child("setYear action in future", (test) =>
        test.step(Calendar().setYear(2015)).assertion(Calendar().has({ title: "August 2015" }))
      )
      .child("setYear action in past", (test) =>
        test.step(Calendar().setYear(2013)).assertion(Calendar().has({ title: "August 2013" }))
      )
      .child("setMonth action in future", (test) =>
        test.step(Calendar().setMonth("September")).assertion(Calendar().has({ title: "September 2014" }))
      )
      .child("setMonth action in past", (test) =>
        test.step(Calendar().setMonth("July")).assertion(Calendar().has({ title: "July 2014" }))
      )
      .child("setMonth action with utils in future", (test) =>
        test.step(CalendarWithUtils().setMonth("September")).assertion(Calendar().has({ title: "September 2014" }))
      )
      .child("setMonth action with utils in past", (test) =>
        test.step(CalendarWithUtils().setMonth("July")).assertion(Calendar().has({ title: "July 2014" }))
      )
      .child("setDay action", (test) => test.step(calendar.setDay(15)).assertion(Calendar("15 August 2014").exists()))
  )
  .child("custom renders", (test) =>
    test
      .child("setDay action with fully custom day render", (test) =>
        test
          .step(
            renderComponent({
              renderDay: (day, _selectedDate, dayInCurrentMonth, _dayComponent) => (
                <button hidden={!dayInCurrentMonth}>{day?.getDate()}</button>
              ),
            })
          )
          .step(Calendar().setDay(20))
          // NOTE There is no way to filter by selected day with a fully custom day render
          // But we still be able do day clicks, just can't test it ¯\_(ツ)_/¯
          .assertion(Calendar("August 2014").exists())
      )
      .child("nextMonth action with custom icon", (test) =>
        test
          .step(renderComponent({ rightArrowIcon: <span /> }))
          .step(calendar.nextMonth())
          .assertion(Calendar().has({ title: "September 2014" }))
      )
      .child("prevMonth action with custom icon", (test) =>
        test
          .step(renderComponent({ leftArrowIcon: <span /> }))
          .step(calendar.prevMonth())
          .assertion(Calendar().has({ title: "July 2014" }))
      )
  );
