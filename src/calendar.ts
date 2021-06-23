import { createInteractor, HTML, including, Interaction, Interactor, not } from "@bigtest/interactor";
import { applyGetter, delay, isHTMLElement } from "./helpers";
import { DatePickerUtils } from "./types";

function getHeaderElement(element: HTMLElement) {
  let header = element.parentElement?.querySelector(".MuiPickersCalendarHeader-switchHeader");
  return isHTMLElement(header) ? header : null;
}

function getTitleElement(element: HTMLElement) {
  let header = element.parentElement?.querySelector(".MuiPickersCalendarHeader-transitionContainer");
  return isHTMLElement(header) ? header : null;
}

function getWeekDaysElement(element: HTMLElement) {
  let daysHeader = element.parentElement?.querySelector(".MuiPickersCalendarHeader-daysHeader");
  return isHTMLElement(daysHeader) ? daysHeader : null;
}

function getSelectedElement(element: HTMLElement) {
  let dayButton = element.querySelector(".MuiPickersDay-daySelected");
  return isHTMLElement(dayButton) ? dayButton : null;
}

function calendarLocator(element: HTMLElement) {
  let header = getTitleElement(element)?.innerText;
  let selectedDay = getSelectedElement(element)?.innerText;
  return [selectedDay, header].filter(Boolean).join(" ");
}

export const getDay = (element: HTMLElement) => {
  let text = getSelectedElement(element)?.innerText;
  let day = text ? parseInt(text) : NaN;
  return Number.isNaN(day) ? undefined : day;
};
export const getMonth = (element: HTMLElement) => getTitleElement(element)?.innerText.replace(/\s[0-9]{4}$/, "");
export const getYear = (element: HTMLElement) => {
  let yearString = getTitleElement(element)?.innerText.replace(/.*\s([0-9]{4})$/, "$1");
  let year = yearString ? parseInt(yearString) : NaN;
  return Number.isNaN(year) ? undefined : year;
};

function goToNextMonth({ perform }: Interactor<HTMLElement, any>) {
  return perform((element) => {
    // NOTE: We can't go upwards by using `Interactor().find(...)`
    let nextMonthElement = getHeaderElement(element)?.lastElementChild;
    if (isHTMLElement(nextMonthElement)) nextMonthElement.click();
  });
}
function goToPrevMonth({ perform }: Interactor<HTMLElement, any>) {
  return perform((element) => {
    // NOTE: We can't go upwards by using `Interactor().find(...)`
    let prevMonthElement = getHeaderElement(element)?.firstElementChild;
    if (isHTMLElement(prevMonthElement)) prevMonthElement.click();
  });
}

async function goToYear(interactor: Interactor<HTMLElement, any>, targetYear: number) {
  let currentMonth = await applyGetter(interactor, getMonth);
  let currentYear = await applyGetter(interactor, getYear);

  if (!currentMonth || !currentYear) throw new Error("Can't get current month and year");
  if (currentYear == targetYear) return;
  let step = currentYear < targetYear ? () => goToNextMonth(interactor) : () => goToPrevMonth(interactor);
  let targetMonth = currentMonth;
  while (currentYear != targetYear || currentMonth != targetMonth) {
    await step();
    await delay(1000);
    let prevMonth: string | undefined = currentMonth;
    currentMonth = await applyGetter(interactor, getMonth);
    currentYear = await applyGetter(interactor, getYear);
    if (prevMonth == currentMonth)
      throw new Error(
        `Can't set '${targetYear}' year. It might happened because of 'minDate/maxDate' or 'disableFuture/disablePast' props`
      );
  }
}
async function goToMonth(
  interactor: Interactor<HTMLElement, any>,
  targetMonth: string,
  directionStep: () => Interaction<void>,
  currentYear?: number
) {
  let currentMonth = await applyGetter(interactor, getMonth);

  if (!currentMonth || !currentYear) throw new Error("Can't get current month and year");
  if (currentMonth == targetMonth) return;

  let targetYear = currentYear;
  while (currentYear != targetYear || currentMonth != targetMonth) {
    await directionStep();
    await delay(1000);
    let prevMonth: string | undefined = currentMonth;
    currentMonth = await applyGetter(interactor, getMonth);
    currentYear = await applyGetter(interactor, getYear);
    if (currentYear != targetYear || currentMonth == prevMonth)
      throw new Error(
        `Can't set '${targetMonth}' month. It might happened because of 'minDate/maxDate' or 'disableFuture/disablePast' props`
      );
  }
}
async function goToDay(interactor: Interactor<HTMLElement, any>, day: number) {
  // NOTE: We can't find day if user has custom day render
  let dayInteractor = interactor.find(HTML.selector(".MuiPickersCalendar-week > [role='presentation']")(String(day)));
  try {
    await dayInteractor.has({ className: not(including("MuiPickersDay-dayDisabled")) });
  } catch (_) {
    throw new Error(`Can't select ${day} day because it's disabled`);
  }
  return dayInteractor.click();
}

export const createCalendar = (utils: DatePickerUtils) =>
  Calendar.filters({
    date: (element) => {
      let header = getTitleElement(element)?.innerText;
      let selectedDay = getSelectedElement(element)?.innerText;
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
    setMonth: async (interactor: Interactor<HTMLElement, any>, targetMonth: string) => {
      let currentMonth = await applyGetter(interactor, getMonth);
      if (!currentMonth) throw new Error("Can't get current month");
      let currentMonthNumber = utils.getMonth(utils.parse(currentMonth, "MMMM"));
      let targetMonthNumber = utils.getMonth(utils.parse(targetMonth, "MMMM"));
      if (currentMonthNumber == targetMonthNumber) return;
      await goToMonth(
        interactor,
        targetMonth,
        currentMonthNumber < targetMonthNumber ? () => goToNextMonth(interactor) : () => goToPrevMonth(interactor),
        await applyGetter(interactor, getYear)
      );
    },
  });

export const Calendar = createInteractor<HTMLElement>("MUI Calendar")
  .selector(".MuiPickersCalendar-transitionContainer")
  .locator(calendarLocator)
  .filters({
    year: getYear,
    month: getMonth,
    day: getDay,
    title: (element) => getTitleElement(element)?.innerText,
    weekDay: (element) => {
      let rootDayElement = getSelectedElement(element)?.parentElement;
      let weekIndex = rootDayElement
        ? Array.from(rootDayElement?.parentElement?.children ?? []).indexOf(rootDayElement)
        : -1;
      let weekDayElement = weekIndex != -1 ? getWeekDaysElement(element)?.children.item(weekIndex) : null;
      return isHTMLElement(weekDayElement) ? weekDayElement.innerText : undefined;
    },
  })
  .actions({
    nextMonth: goToNextMonth,
    prevMonth: goToPrevMonth,
    setYear: goToYear,
    setMonth: async (interactor: Interactor<HTMLElement, any>, targetMonth: string) => {
      let currentYear = await applyGetter(interactor, getYear);

      let directions = [() => goToPrevMonth(interactor), () => goToNextMonth(interactor)];
      directions = Math.round(Math.random()) ? directions : directions.reverse();
      let directionStep = directions.shift() as () => Interaction<void>;

      try {
        await goToMonth(interactor, targetMonth, directionStep, currentYear);
      } catch (_) {
        directionStep = directions.shift() as () => Interaction<void>;
        await goToMonth(interactor, targetMonth, directionStep, currentYear);
      }
    },
    setDay: goToDay,
  });
