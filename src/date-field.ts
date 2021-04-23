import { TextField } from "bigtest";
import { dispatchChange, setValue } from "./helpers";

export const DateField = TextField.extend<HTMLInputElement>("date field")
  .selector('input[type="date"]')
  .filters({
    date: (element) => element.valueAsDate,
    timestamp: (element) => element.valueAsNumber,
  })
  .actions({
    fillIn: ({ perform }, value: string | Date) =>
      perform((element) => {
        setValue(element, typeof value == "string" ? value : value.toISOString().replace(/T.*$/, ""));
        dispatchChange(element);
      }),
  });
