import { describe, it } from 'mocha';
import expect from 'expect';
import { dom } from './helpers';

import { createInteractor } from '../src/index';

const Header = createInteractor('header')
  .filters({
    text: (e) => e.textContent
  })
  .selector('h1,h2,h3,h4,h5,h6')

const Calendar = createInteractor<HTMLElement>("calendar")
  .selector("div.calendar")

const TextField = createInteractor<HTMLInputElement>('text field')
  .selector('input')
  .filters({
    placeholder: element => element.placeholder,
  })
  .actions({
    click: ({ perform }) => perform((e) => e.click())
  });

const Datepicker = createInteractor<HTMLDivElement>("datepicker")
  .selector("div.datepicker")
  .locator(element => element.querySelector("label")?.textContent || "")
  .filters({
    open: Calendar().exists(),
    month: Calendar().find(Header()).text(),
  })
  .actions({
    toggle: async interactor => {
      await interactor.find(TextField({ placeholder: "YYYY-MM-DD" })).click();
    }
  });

describe('filters delegation', () => {
  it('delegates the filter to a child element', async () => {
    dom(`
      <div class="datepicker">
        <label for="start-date">Start Date</label>
        <input type="text" id="start-date" placeholder="YYYY-MM-DD" />
      </div>
      <script>
        let startDateInput = document.getElementById("start-date");
        let datepicker = document.querySelector(".datepicker");
        startDateInput.onclick = () => {
          let calendar = document.createElement("div");
          let calendarMonth = document.createElement("h4");
          calendarMonth.appendChild(document.createTextNode("January"));
          calendar.classList.add("calendar");
          calendar.appendChild(calendarMonth);
          datepicker.appendChild(calendar);
        };
      </script>
    `);

    await expect(Datepicker("Start Date").has({ open: false })).resolves.toBeUndefined();
    await Datepicker("Start Date").toggle();
    await expect(Datepicker("Start Date").has({ open: true })).resolves.toBeUndefined();
    await expect(Datepicker("Start Date").has({ month: "January" })).resolves.toBeUndefined();
  });

  it('throws an error if the delegated element does not exist', async () => {
    dom(`
      <div class="datepicker">
        <label for="start-date">Start Date</label>
        <input type="text" id="start-date" placeholder="YYYY-MM-DD" />
        <div class="calendar">
        </div>
      </div>
    `);

    await expect(Datepicker("Start Date").has({ month: "January" })).rejects.toHaveProperty('message', 'did not find header within calendar');
  });

  it('throws an error if the delegated element parent does not exist', async () => {
    dom(`
      <div class="datepicker">
        <label for="start-date">Start Date</label>
        <input type="text" id="start-date" placeholder="YYYY-MM-DD" />
      </div>
    `);

    await expect(Datepicker("Start Date").has({ month: "January" })).rejects.toHaveProperty('message', 'did not find calendar');
  });

  it('throws an error if the delegated element is ambiguous', async () => {
    dom(`
      <div class="datepicker">
        <label for="start-date">Start Date</label>
        <input type="text" id="start-date" placeholder="YYYY-MM-DD" />
        <div class="calendar">
          <h4 class="first">January</h4>
          <h4 class="second">May</h4>
        </div>
      </div>
    `);

    await expect(Datepicker("Start Date").has({ month: "January" })).rejects.toHaveProperty('message', [
      'header within calendar matches multiple elements:',
      '',
      '- <h4 class="first">',
      '- <h4 class="second">'
    ].join('\n'));
  });

  it('throws an error if the delegated element parent is ambiguous', async () => {
    dom(`
      <div class="datepicker">
        <label for="start-date">Start Date</label>
        <input type="text" id="start-date" placeholder="YYYY-MM-DD" />
        <div class="calendar first">
          <h4>January</h4>
        </div>
        <div class="calendar second">
          <h4>May</h4>
        </div>
      </div>
    `);

    await expect(Datepicker("Start Date").has({ month: "January" })).rejects.toHaveProperty('message', [
      'calendar matches multiple elements:',
      '',
      '- <div class="calendar first">',
      '- <div class="calendar second">',
    ].join('\n'));
  });
});
