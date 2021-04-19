import { test, Page } from "bigtest";
import { Calendar as Component } from "@material-ui/pickers";
import { Calendar, getCalendar } from "../src";
import { getPickerRenderer } from "./helpers";
import DateFnsUtils from "@date-io/date-fns";

const renderComponent = getPickerRenderer(Component);
const CalendarWithUtils = getCalendar(new DateFnsUtils());
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
      // TODO Don't work well on different environments
      // .assertion(CalendarWithUtils({ date: new Date("2014-08-18") }).exists())
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
      // TODO What should do if user want to click on the disabled `nextMonth` button? Raise exception? Do nothing?
      // TODO How to test an exception with BigTest?
      // TODO The same for `prevMonth` and `setDay` and `shouldDisableDate`
      // TODO Props to test `disableFuture`, `disablePast`, `maxDate`, `minDate`
      // .child("nextMonth action with disableFuture", (test) =>
      //   test
      //     .step(renderComponent({ date: new Date(), disableFuture: true }))
      //     .step(Calendar().nextMonth())
      //     .assertion(Calendar().has({ title: "???" }))
      // )
      // TODO Test exception message?
      // .child("setDay action on disabled day", (test) =>
      //   test
      //     .step(renderComponent({ maxDate: new Date("2014-08-18") }))
      //     .step(calendar.setDay(20))
      //     .assertion(calendar.exists())
      // )
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
      // TODO But 4th day appears twice :(
      // .child(
      //   "setDay action with 'semi-transparent' days",
      //   (test) =>
      //     test.step(
      //       // NOTE: Another `cool` thing we can render days from prev/next months and they are clickable
      //       renderComponent((onChange) => ({
      //         renderDay: (day, _selectedDate, dayInCurrentMonth, dayComponent) =>
      //           cloneElement(dayComponent, {
      //             hidden: false,
      //             ...(dayInCurrentMonth
      //               ? undefined
      //               : { style: { opacity: "0.5" }, onClick: () => onChange?.(day as Date) }),
      //           }),
      //       }))
      //     )
      //   // .step(Calendar().setDay(4))
      //   // .assertion(Calendar("4 September 2014").exists())
      // )
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
