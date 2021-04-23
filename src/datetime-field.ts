import { TextField } from "bigtest";
import { dispatchChange, setValue } from "./helpers";

export const DateTimeField = TextField.extend<HTMLInputElement>("datetime field")
  .selector('input[type="datetime-local"]')
  .filters({ timestamp: (element) => element.valueAsNumber })
  .actions({
    fillIn: ({ perform }, value: string | Date) =>
      perform((element) => {
        setValue(element, typeof value == "string" ? value : value.toISOString().replace(/Z$/, ""));
        dispatchChange(element);
      }),
  });
