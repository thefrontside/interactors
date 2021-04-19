import { Page, test } from "bigtest";
import { TextField as Component } from "@material-ui/core";
import { DateTimeField } from "../src";
import { getComponentRenderer } from "./helpers";

const renderComponent = getComponentRenderer(Component, {
  id: "datetimefield",
  label: "datetimefield",
  type: "datetime-local",
});
const datetimefield = DateTimeField("datetimefield");

export default test("DateTimeField")
  .step(Page.visit("/"))
  .child("default", (test) =>
    test
      .step(renderComponent())
      .assertion(datetimefield.has({ value: "" }))
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
        test.step(datetimefield.fillIn("2014-08-18T09:13")).assertion(datetimefield.has({ value: "2014-08-18T09:13" }))
      )
      .child("fillIn yyyy-MM-ddThh:mm:ss", (test) =>
        test
          .step(datetimefield.fillIn("2014-08-18T09:13:37"))
          .assertion(datetimefield.has({ value: "2014-08-18T09:13:37" }))
      )
  );
