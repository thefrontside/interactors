import { createInteractor, HTML, including, Interaction, Interactor, not } from "@bigtest/interactor";
import { applyGetter, delay, isHTMLElement } from "./helpers";
import { DatePickerUtils } from "./types";

function getHeaderElement(element: HTMLElement) {
  const header = element.parentElement?.querySelector(".MuiPickersCalendarHeader-switchHeader");
  return isHTMLElement(header) ? header : null;
}

function getTitleElement(element: HTMLElement) {
  const header = element.parentElement?.querySelector(".MuiPickersCalendarHeader-transitionContainer");
  return isHTMLElement(header) ? header : null;
}

function getWeekDaysElement(element: HTMLElement) {
  const daysHeader = element.parentElement?.querySelector(".MuiPickersCalendarHeader-daysHeader");
  return isHTMLElement(daysHeader) ? daysHeader : null;
}

function getSelectedElement(element: HTMLElement) {
  const dayButton = element.querySelector(".MuiPickersDay-daySelected");
  return isHTMLElement(dayButton) ? dayButton : null;
}

function calendarLocator(element: HTMLElement) {
  const header = getTitleElement(element)?.innerText;
  const selectedDay = getSelectedElement(element)?.innerText;
  return [selectedDay, header].filter(Boolean).join(" ");
}

export const getDay = (element: HTMLElement) => {
  const text = getSelectedElement(element)?.innerText;
  const day = text ? parseInt(text) : NaN;
  return Number.isNaN(day) ? undefined : day;
};
export const getMonth = (element: HTMLElement) => getTitleElement(element)?.innerText.replace(/\s[0-9]{4}$/, "");
export const getYear = (element: HTMLElement) => {
  const yearString = getTitleElement(element)?.innerText.replace(/.*\s([0-9]{4})$/, "$1");
  const year = yearString ? parseInt(yearString) : NaN;
  return Number.isNaN(year) ? undefined : year;
};

function goToNextMonth({ perform }: Interactor<HTMLElement, any>) {
  return perform((element) => {
    // NOTE: We can't go upwards by using `Interactor().find(...)`
    const nextMonthElement = getHeaderElement(element)?.lastElementChild;
    if (isHTMLElement(nextMonthElement)) nextMonthElement.click();
  });
}
function goToPrevMonth({ perform }: Interactor<HTMLElement, any>) {
  return perform((element) => {
    // NOTE: We can't go upwards by using `Interactor().find(...)`
    const prevMonthElement = getHeaderElement(element)?.firstElementChild;
    if (isHTMLElement(prevMonthElement)) prevMonthElement.click();
  });
}

async function goToYear(interactor: Interactor<HTMLElement, any>, targetYear: number) {
  let currentMonth = await applyGetter(interactor, getMonth);
  let currentYear = await applyGetter(interactor, getYear);

  if (!currentMonth || !currentYear) throw new Error("Can't get current month and year");
  if (currentYear == targetYear) return;
  const step = currentYear < targetYear ? () => goToNextMonth(interactor) : () => goToPrevMonth(interactor);
  const targetMonth = currentMonth;
  while (currentYear != targetYear || currentMonth != targetMonth) {
    await step();
    await delay(1000);
    const prevMonth: string | undefined = currentMonth;
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

  const targetYear = currentYear;
  while (currentYear != targetYear || currentMonth != targetMonth) {
    await directionStep();
    await delay(1000);
    const prevMonth: string | undefined = currentMonth;
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
  const dayInteractor = interactor.find(HTML.selector(".MuiPickersCalendar-week > [role='presentation']")(String(day)));
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
      const header = getTitleElement(element)?.innerText;
      const selectedDay = getSelectedElement(element)?.innerText;
      const monthAndYear = header ? utils.parse(header, "MMMM yyyy") ?? new Date() : new Date();
      const day = selectedDay ? parseInt(selectedDay) : NaN;
      const month = monthAndYear.getMonth() + 1;
      const year = monthAndYear.getFullYear();
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
      const currentMonthNumber = utils.getMonth(utils.parse(currentMonth, "MMMM"));
      const targetMonthNumber = utils.getMonth(utils.parse(targetMonth, "MMMM"));
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
      const rootDayElement = getSelectedElement(element)?.parentElement;
      const weekIndex = rootDayElement
        ? Array.from(rootDayElement?.parentElement?.children ?? []).indexOf(rootDayElement)
        : -1;
      const weekDayElement = weekIndex != -1 ? getWeekDaysElement(element)?.children.item(weekIndex) : null;
      return isHTMLElement(weekDayElement) ? weekDayElement.innerText : undefined;
    },
  })
  .actions({
    nextMonth: goToNextMonth,
    prevMonth: goToPrevMonth,
    setYear: goToYear,
    setMonth: async (interactor: Interactor<HTMLElement, any>, targetMonth: string) => {
      const currentYear = await applyGetter(interactor, getYear);

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
