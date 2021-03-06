import { test, visit } from "bigtest";
import { TextField as Component } from "@material-ui/core";
import { DateField, matching, some } from "../src";
import { createRenderStep } from "./helpers";

const renderDateField = createRenderStep(Component, { id: "datefield", label: "datefield", type: "date" });
const datefield = DateField("datefield");

export default test("DateField")
  .step(visit("/"))
  .child("default", (test) =>
    test
      .step(renderDateField())
      .assertion(datefield.has({ value: "" }))
      .assertion(datefield.has({ classList: some(matching(/MuiInput-input-\d+/)) }))
      .child("fillIn string", (test) =>
        test
          .step(datefield.fillIn("2014-08-18"))
          .assertion(datefield.has({ value: "2014-08-18" }))
          .assertion(datefield.has({ date: new Date("2014-08-18") }))
          .assertion(datefield.has({ timestamp: new Date("2014-08-18").getTime() }))
      )
      .child("fillIn date", (test) =>
        test
          .step(datefield.fillIn(new Date("2014-08-18")))
          .assertion(datefield.has({ value: "2014-08-18" }))
      )
  )
  .child("min/max", (test) =>
    test
      .step(renderDateField({ inputProps: { min: "2013-07-15", max: "2015-09-21" } }))
      .step(datefield.fillIn("2014-08-18"))
      .assertion(datefield.has({ value: "2014-08-18" }))
      .child("before min", (test) =>
        test
          .step(datefield.fillIn("2012-06-13"))
          .assertion(datefield.has({ value: "2012-06-13" }))
      )
      .child("after max", (test) =>
        test
          .step(datefield.fillIn("2016-10-26"))
          .assertion(datefield.has({ value: "2016-10-26" }))
      )
  );
