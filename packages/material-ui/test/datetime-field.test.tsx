import { test } from "bigtest";
import { TextField as Component } from "@material-ui/core";
import { DateTimeField, matching, some, Page } from "../src";
import { createRenderStep } from "./helpers";

const renderDateTimeField = createRenderStep(Component, {
  id: "datetimefield",
  label: "datetimefield",
  type: "datetime-local",
});
const datetimefield = DateTimeField("datetimefield");

export default test("DateTimeField")
  .step(Page.visit("/"))
  .child("default", (test) =>
    test
      .step(renderDateTimeField())
      .assertion(datetimefield.has({ value: "" }))
      .assertion(datetimefield.has({ classList: some(matching(/MuiInput-input-\d+/)) }))
      .child("fillIn string", (test) =>
        test
          .step(datetimefield.fillIn("2014-08-18T09:13:37.512"))
          .assertion(datetimefield.has({ value: "2014-08-18T09:13:37.512" }))
          .assertion(datetimefield.has({ timestamp: new Date("2014-08-18T09:13:37.512Z").getTime() }))
      )
      .child("fillIn date", (test) =>
        test
          .step(datetimefield.fillIn(new Date("2014-08-18T09:13:37.512Z")))
          .assertion(datetimefield.has({ value: "2014-08-18T09:13:37.512" }))
      )
      .child("fillIn yyyy-MM-ddThh:mm", (test) =>
        test
          .step(datetimefield.fillIn("2014-08-18T09:13"))
          .assertion(datetimefield.has({ value: "2014-08-18T09:13" }))
      )
      .child("fillIn yyyy-MM-ddThh:mm:ss", (test) =>
        test
          .step(datetimefield.fillIn("2014-08-18T09:13:37"))
          .assertion(datetimefield.has({ value: "2014-08-18T09:13:37" }))
      )
  );
