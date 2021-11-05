---
id: assertions
title: Assertions
---

With assertions you can verify that your application behaves like you expect.

## `exists` and `absent`

We've already met `exists`, which checks that an element exists on the page. An
assertion with `exists` passes if there is at least one element which matches.

Exists has a cousin `absent`, which does the opposite, checking that there is
no matching element.

``` js
await Button('Submit').absent();
```

:::note
These assertion methods are equivalents of Jest's `expect` and Cypress' `should`. When refactoring your test with Interactors, you would replace those constructs with the interactors' assertion methods.
:::

## `has` and `is`

You can use `has` to check if a filter defined by the interactor matches. For
example, the `TextField` interactor has a `value` filter which returns the
current value of the text field. So to check that the value of the 'Username'
field is 'Taylor', we could do somthing like this:

```js
await TextField('Username').has({ value: 'Taylor' });
```

This first finds the username field, and then checks that its value is 'Taylor'.
Just like with actions, if there are multiple 'Username' fields this will throw
an error.

We could have written an assertion using `exists` as well:

```js
await TextField('Username', { value: 'Taylor' }).exists();
```

But this is slightly different! If there were multiple 'Username' fields, one
of which has the value 'Taylor', then `has` would throw an error, but `exists`
would not!

Whether you use `exists` or `has` depends on the situation. Use `has` when you
know that an element exists, and you want to make an assertion about it.
Checking the value of a text field is a good example for when to use `has`. Use
`exists` when you want to assert that an element exists.

The `is()` method is an alias of `has()`. There is absolutely no difference in
the way it works, but you can use it to make your code more readable.

For instance, if we wanted to test if a text field is visible, `has()` would
work perfectly fine; but writing the test using `is()` would read more like a
sentence:

```js
await TextField('Username').is({ visible: true });
```

## Waiting

Just like with actions, assertions are always retried for a period of time.
This ensures that we don't get random failures due to timing.

For example, if we're checking that a button is absent, we might write
something like this:

``` js
await Button('Submit').absent();
```

If the button is still there, but it will disappear after a short period of
time, the interactor will keep searching to check if the button is still there
for a while. As soon as it disappears, the assertion passes. If the button does
not disappear, then our assertion will eventually time out, and it will fail.
