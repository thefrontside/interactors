import { TextField } from "bigtest";
import { dispatchChange, setValue } from "./helpers";

export const TimeField = TextField.extend<HTMLInputElement>("time field")
  .selector('input[type="time"]')
  .filters({
    date: (element) => element.valueAsDate,
    timestamp: (element) => element.valueAsNumber,
  })
  .actions({
    fillIn: ({ perform }, value: string | Date) =>
      perform((element) => {
        setValue(element, typeof value == "string" ? value : value.toISOString().replace(/^.*T(.*)Z$/, "$1"));
        dispatchChange(element);
      }),
  });
