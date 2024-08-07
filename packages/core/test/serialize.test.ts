import { expect, describe, it } from "./deps.ts";
import { HTML, TextField } from "./fixtures.ts";
import { including, or } from "../mod.ts";
import { dom } from "./helpers.ts";

describe("serialize", () => {
  it("should serialize .exists()/.absent()", () => {
    expect(TextField("Login").exists().code()).toEqual('TextField("Login", { "enabled": true }).exists()');
    expect(TextField("FooBar").absent().code()).toEqual('TextField("FooBar", { "enabled": true }).absent()');
  });

  it("should serialize with additional filters", () => {
    expect(TextField("Login", { id: "login", value: "jonas@example.com" }).exists().code()).toEqual(
      'TextField("Login", { "id": "login", "value": "jonas@example.com", "enabled": true }).exists()'
    );
    expect(TextField("FooBar", { placeholder: "Login" }).absent().code()).toEqual(
      'TextField("FooBar", { "placeholder": "Login", "enabled": true }).absent()'
    );
  });

  it("should serialize .is()/.has()", () => {
    expect(TextField("Login").is({ focused: true }).code()).toEqual(
      'TextField("Login", { "enabled": true }).is({ "focused": true })'
    );
    expect(TextField("Login").has({ value: "jonas@example.com" }).code()).toEqual(
      'TextField("Login", { "enabled": true }).is({ "value": "jonas@example.com" })'
    );
  });

  it("should serialize matchers", () => {
    expect(
      TextField(/^login.*/i, { enabled: or(false, true) })
        .has({ value: including("example.com") })
        .code()
    ).toEqual(
      'TextField(matching(/^login.*/i), { "enabled": or(false, true) }).is({ "value": including("example.com") })'
    );
  });

  it("can skip serialization for non-stringifyable objects", () => {
    let window = dom('<input id="Login" value="jonas@example.com" />');

    expect(
      TextField("Login")
        .has({
          body: window.document.body,
          attributeSetter: function attributeSetter() {},
          rect: window.document.documentElement.getBoundingClientRect(),
        })
        .code()
    ).toEqual(
      'TextField("Login", { "enabled": true }).is({ "body": {}, "attributeSetter": undefined, "rect": {"x":0,"y":0,"bottom":0,"height":0,"left":0,"right":0,"top":0,"width":0} })'
    );
  });

  it("should serialize .perform/.assert", () => {
    expect(
      TextField("Login")
        .perform((element) => element.focus())
        .code()
    ).toEqual('TextField("Login", { "enabled": true }).perform()');
    expect(
      TextField("Login")
        .assert((element) => element.hasAttribute("aria-label"))
        .code()
    ).toEqual('TextField("Login", { "enabled": true }).assert()');
  });

  it("should serialize actions", () => {
    expect(TextField("Login").click().code()).toEqual('TextField("Login", { "enabled": true }).click()');
    expect(TextField("Login").fillIn("jonas@example.com").code()).toEqual(
      'TextField("Login", { "enabled": true }).fillIn("jonas@example.com")'
    );
  });

  it("should serialize getters", () => {
    expect(TextField("Login").placeholder().code()).toEqual('TextField("Login", { "enabled": true }).placeholder()');
  });

  it("should serialize interaction with .find()", () => {
    expect(HTML().find(TextField("Login")).exists().code()).toEqual(
      'Element().find(TextField("Login", { "enabled": true })).exists()'
    );
    expect(
      HTML("Foo")
        .find(HTML("Bar").find(HTML("Spam")))
        .exists()
        .code()
    ).toEqual('Element("Foo").find(Element("Bar")).find(Element("Spam")).exists()');
  });
});
