# @interactors/material-ui

The collection of [interactors](https://frontside.com/bigtest/interactors) for basic
[Material-UI](https://material-ui.com) components. Simplifies your tests by providing
a nice and powerful API to emulate user interactions and make short and elegant assertions.

## Usage

```typescript
import { test } from "bigtest";
import { Button, DateField, Popover, Select, Slider, TextField } from "@interactors/material-ui";

test("SignUp")
  .step(TextField("Username").fillIn("JohnDow"))
  .step(TextField("Password").fillIn("VeryStrongPassword"))
  .step(TextField("Repeat password").fillIn("VeryStrongPassword"))
  .step(Select("Gender").choose("Male"))
  .step(DateField("Date of birth").fillIn("1990-03-17"))
  .step(Slider("Your satisfaction").setValue(10))
  .step(Button("Submit").click())
  .assertion(Popover("Registration successful").exists());
```
