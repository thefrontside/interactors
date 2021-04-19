import { Page, test } from "bigtest";
import { TextField as Component } from "@material-ui/core";
import { TimeField } from "../src";
import { getComponentRenderer } from "./helpers";

const renderComponent = getComponentRenderer(Component, { id: "timefield", label: "timefield", type: "time" });
const timefield = TimeField("timefield");

export default test("TimeField")
  .step(Page.visit("/"))
  .child("default", (test) =>
    test
      .step(renderComponent())
      .assertion(timefield.has({ value: "" }))
      .child("fillIn string", (test) =>
        test
          .step(timefield.fillIn("09:13:37.512"))
          .assertion(timefield.has({ value: "09:13:37.512" }))
          .assertion(timefield.has({ date: new Date("1970-01-01T09:13:37.512Z") }))
          .assertion(timefield.has({ timestamp: new Date("1970-01-01T09:13:37.512Z").getTime() }))
      )
      .child("fillIn date", (test) =>
        test
          .step(timefield.fillIn(new Date("2014-08-18T09:13:37.512Z")))
          .assertion(timefield.has({ value: "09:13:37.512" }))
      )
      .child("fillIn hh:mm", (test) =>
        test.step(timefield.fillIn("09:13")).assertion(timefield.has({ value: "09:13" }))
      )
      .child("fillIn hh:mm:ss", (test) =>
        test.step(timefield.fillIn("09:13:37")).assertion(timefield.has({ value: "09:13:37" }))
      )
  );
