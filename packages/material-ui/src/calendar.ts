import { click, HTML, createInteractor, including, Interaction, Interactor, not, innerText } from "@interactors/html";
import { delay, isHTMLElement } from "./helpers";
import { DatePickerUtils } from "./types";

function getHeaderElement(element: HTMLElement) {
  let header = element.parentElement?.querySelector('[class*="MuiPickersCalendarHeader-switchHeader"]');
  return isHTMLElement(header) ? header : null;
}

function getTitleElement(element: HTMLElement) {
  let header = element.parentElement?.querySelector('[class*="MuiPickersCalendarHeader-transitionContainer"]');
  return isHTMLElement(header) ? header : null;
}

function getWeekDaysElement(element: HTMLElement) {
  let daysHeader = element.parentElement?.querySelector('[class*="MuiPickersCalendarHeader-daysHeader"]');
  return isHTMLElement(daysHeader) ? daysHeader : null;
}

function getSelectedElement(element: HTMLElement) {
  let dayButton = element.querySelector('[class*="MuiPickersDay-daySelected"]');
  return isHTMLElement(dayButton) ? dayButton : null;
}

function calendarLocator(element: HTMLElement) {
  let header = innerText(getTitleElement(element));
  let selectedDay = innerText(getSelectedElement(element));
  return [selectedDay, header].filter(Boolean).join(" ");
}

export const getDay = (element: HTMLElement): number | undefined => {
  let text = innerText(getSelectedElement(element));
  let day = text ? parseInt(text) : NaN;
  return Number.isNaN(day) ? undefined : day;
};
export const getMonth = (element: HTMLElement): string | undefined =>
  innerText(getTitleElement(element)).replace(/\s[0-9]{4}$/, "");
export const getYear = (element: HTMLElement): number | undefined => {
  let yearString = innerText(getTitleElement(element)).replace(/.*\s([0-9]{4})$/, "$1");
  let year = yearString ? parseInt(yearString) : NaN;
  return Number.isNaN(year) ? undefined : year;
};

async function goToMonth(
  interactor: ReturnType<typeof Calendar>,
  targetMonth: string,
  directionStep: () => Interaction<HTMLElement>,
  currentYear?: number
) {
  let currentMonth = await interactor.month();

  if (!currentMonth || !currentYear) throw new Error("Can't get current month and year");
  if (currentMonth == targetMonth) return;

  let targetYear = currentYear;
  while (currentYear != targetYear || currentMonth != targetMonth) {
    await directionStep();
    await delay(1000);
    let prevMonth: string | undefined = currentMonth;
    currentMonth = await interactor.month();
    currentYear = await interactor.year();
    if (currentYear != targetYear || currentMonth == prevMonth)
      throw new Error(
        `Can't set '${targetMonth}' month. It might happened because of 'minDate/maxDate' or 'disableFuture/disablePast' props`
      );
  }
}
async function goToDay<T>(interactor: Interactor<HTMLElement, T>, day: number) {
  // NOTE: We can't find day if user has custom day render
  let dayInteractor = interactor.find(
    HTML.selector('[class*="MuiPickersCalendar-week"] > [role="presentation"]')(String(day))
  );
  try {
    await dayInteractor.has({ className: not(including("MuiPickersDay-dayDisabled")) });
  } catch (_) {
    throw new Error(`Can't select ${day} day because it's disabled`);
  }
  return dayInteractor.click();
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createCalendar(utils: DatePickerUtils) {
  return Calendar.filters({
    date: (element) => {
      let header = innerText(getTitleElement(element));
      let selectedDay = innerText(getSelectedElement(element));
      let monthAndYear = header ? utils.parse(header, "MMMM yyyy") ?? new Date() : new Date();
      let day = selectedDay ? parseInt(selectedDay) : NaN;
      let month = monthAndYear.getMonth() + 1;
      let year = monthAndYear.getFullYear();
      // NOTE: Date.toISOString() depends on local timezone and returns different results of local machine and CI
      return Number.isNaN(day)
        ? new Date()
        : new Date(
            `${year}-${String(month).replace(/^(\d)$/, "0$1")}-${String(day).replace(/^(\d)$/, "0$1")}T00:00:00.000Z`
          );
    },
  }).actions({
    setMonth: async (interactor, targetMonth: string) => {
      let currentMonth = await interactor.month();
      if (!currentMonth) throw new Error("Can't get current month");
      let currentMonthNumber = utils.getMonth(utils.parse(currentMonth, "MMMM"));
      let targetMonthNumber = utils.getMonth(utils.parse(targetMonth, "MMMM"));
      if (currentMonthNumber == targetMonthNumber) return;
      await goToMonth(
        interactor,
        targetMonth,
        currentMonthNumber < targetMonthNumber ? () => interactor.nextMonth() : () => interactor.prevMonth(),
        await interactor.year()
      );
    },
  });
}

const CalendarInteractor = createInteractor<HTMLElement>("MUICalendar")
  .selector('[class*="MuiPickersCalendar-transitionContainer"]')
  .locator(calendarLocator)
  .filters({
    year: getYear,
    month: getMonth,
    day: getDay,
    title: (element) => innerText(getTitleElement(element)),
    weekDay: (element) => {
      let rootDayElement = getSelectedElement(element)?.parentElement;
      let weekIndex = rootDayElement
        ? Array.from(rootDayElement?.parentElement?.children ?? []).indexOf(rootDayElement)
        : -1;
      let weekDayElement = weekIndex != -1 ? getWeekDaysElement(element)?.children.item(weekIndex) : null;
      return isHTMLElement(weekDayElement) ? innerText(weekDayElement) : undefined;
    },
  })
  .actions({
    nextMonth: ({ perform }) => {
      return perform((element) => {
        // NOTE: We can't go upwards by using `Interactor().find(...)`
        let nextMonthElement = getHeaderElement(element)?.lastElementChild;
        if (isHTMLElement(nextMonthElement)) click(nextMonthElement);
      });
    },
    prevMonth: ({ perform }) => {
      return perform((element) => {
        // NOTE: We can't go upwards by using `Interactor().find(...)`
        let prevMonthElement = getHeaderElement(element)?.firstElementChild;
        if (isHTMLElement(prevMonthElement)) click(prevMonthElement);
      });
    },
  })
  .actions({
    setYear: async (interactor, targetYear: number) => {
      let currentMonth = await interactor.month();
      let currentYear = await interactor.year();

      if (!currentMonth || !currentYear) throw new Error("Can't get current month and year");
      if (currentYear == targetYear) return;
      let step = currentYear < targetYear ? () => interactor.nextMonth() : () => interactor.prevMonth();
      let targetMonth = currentMonth;
      while (currentYear != targetYear || currentMonth != targetMonth) {
        await step();
        await delay(1000);
        let prevMonth: string | undefined = currentMonth;
        currentMonth = await interactor.month();
        currentYear = await interactor.year();
        if (prevMonth == currentMonth)
          throw new Error(
            `Can't set '${targetYear}' year. It might happened because of 'minDate/maxDate' or 'disableFuture/disablePast' props`
          );
      }
    },
    setMonth: async (interactor, targetMonth: string) => {
      let currentYear = await interactor.year();

      let directions = [() => interactor.prevMonth(), () => interactor.nextMonth()];
      directions = Math.round(Math.random()) ? directions : directions.reverse();
      let directionStep = directions.shift() as () => Interaction<HTMLElement>;

      try {
        await goToMonth(interactor as ReturnType<typeof Calendar>, targetMonth, directionStep, currentYear);
      } catch (_) {
        directionStep = directions.shift() as () => Interaction<HTMLElement>;
        await goToMonth(interactor as ReturnType<typeof Calendar>, targetMonth, directionStep, currentYear);
      }
    },
    setDay: goToDay,
  });

/**
 * Call this {@link InteractorConstructor} to initialize a calendar {@link Interactor}.
 * The calendar interactor can be used to interact with calendars on the page and
 * to assert on their state.
 *
 * The calendar is located by selected day and title text divided by space (ex. '18 August 2014').
 *
 * ### Example
 *
 * ``` typescript
 * await Calendar('18 August 2014').setDay(13);
 * await Calendar('18 August 2014').has({ weekDay: 'Mo' });
 * await Calendar({ title: 'August 2014', day: 18 }).exists();
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – Filter by title
 * - `year`: *number* – Filter by year
 * - `month`: *string* – Filter by month
 * - `day`: *number* – Filter by day
 * - `weekDay`: *string* – Filter by weekDay
 *
 * ### Actions
 *
 * - `nextMonth()`: *{@link Interaction}* – Switch calendar view to the next month
 * - `prevMonth()`: *{@link Interaction}* – Switch calendar view to the previous month
 * - `setYear(value: number)`: *{@link Interaction}* – Switch calendar view to the target year
 * - `setMonth(value: string)`: *{@link Interaction}* – Switch calendar view to the target month
 * - `setDay(value: number)`: *{@link Interaction}* – Set a new date for calendar with previously selected year and month
 *
 * @category Interactor
 */
export const Calendar = CalendarInteractor;
