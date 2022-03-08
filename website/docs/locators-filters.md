---
id: locators-filters
title: Locators and Filters
---

Whether they are predefined or written by you, all interactors have some things in common. They have to be able to find elements in the page and manipulate them like a user would. To do these things, Interactors use a _locator_, _filters_, and _actions_.

## The Locator

One benefit of Interactors is that they help you align your tests with how a user actually interacts with the app, starting with finding what to act upon. A locator is the simplest way to find a specific element in a user interface.

When you use an Interactor in a test, you can pass it a string or a regular expression. This argument would be the Locator - like for "Submit" in the examples below:

```js
await Button('Submit').exists();
```

A typical user identifies a button by the words printed across it, so in this example they would consider a button with the word 'Submit' on it as the "Submit" button. Interactors use locators to make that connection.

What is going on behind the scenes? Just like the user, the predefined Button interactor looks for a button with "Submit" on it. It uses [element.innerText](https://github.com/thefrontside/interactors/blob/main/packages/html/src/button.ts#L11) to find the match. Or to put it another way, `Button('Submit')` returns a button element whose `element.innerText` is equal to `Submit`.

### The locator is optional

Sometimes, there may be only one element that matches an interactor. In those cases, you could omit the locator.

For example, if there was only one button rendered in a test, you could reference it like this:

```js
await Button().click();
```

However, when performing an action with an interactor, such as `click`, there must be exactly one element that matches the interactor. Interactors force you to be specific about which element you want to interact with. If there were multiple buttons, you would need to use a locator or filters to distinguish between them.

## Filters

Another way of narrowing down the element that you want to reference is with filters. Filters are an object passed to an interactor, like the object with `id` in the example below:

```js
await TextField('Username', { id: 'username-id' }).exists();
```

:::note How is the textfield located?
The locator of the `TextField` interactor is the `innerText` of its associated label:

```html
<label>
  Username
  <input type='text' id='username-id'/>
</label>
```

_This is just the way the predefined TextField interactor is configured. It is
possible to [modify pre-existing](http://localhost:3000/interactors/docs/create-first-interactor#extending-an-interactor)
interactors such as this TextField interactor or [create your own interactors](http://localhost:3000/interactors/docs/create-first-interactor#starting-from-scratch)
from scratch to suit your needs._
:::

You can think of the locator as the "default filter" since filters and locators both provide the same functionality. The reason why Interactors offers both solutions is convenience, because having to pass in an object for each interactor can get repetitive.

Filters are useful in a variety of contexts. For example, most forms have multiple textfields. You would need to use a filter if they do not have labels or if there are multiple labels with the same value, as a locator would not work in such a scenario.

Take for instance, this example of a form with textfields that do not have labels:

```html
<form>
  <input id='username-id' type='text' placeholder='USERNAME'/>
  <input id='password-id' type='password' placeholder='PASSWORD'/>
</form>
```

We cannot specify a locator based on the label, so using `TextField()` without a locator would return two elements and therefore produce an error. We can narrow down from two TextFields to one using either the `id` or `placeholder` filters provided by the predefined `TextField` interactor:

```js
await TextField({ id: 'username-id' }).exists();
await TextField({ placeholder: 'PASSWORD' }).exists();
```

The filter object can take as many properties as you want it to:

```js
await TextField({ id: 'username-id', placeholder: 'USERNAME', visible: true }).exists();
```

The filters available are defined by each interactor, so look at the source code for the predefined interactors to know what is available. For example, if you take a look at the [TextField source code](https://github.com/thefrontside/interactors/blob/main/packages/html/src/text-field.ts), you'll see that the TextField interactor provides two filters. In addition, TextField inherits all of the properties of the [FormField interactor](https://github.com/thefrontside/interactors/blob/main/packages/html/src/form-field.ts) and [HTML interactor](https://github.com/thefrontside/interactors/blob/main/packages/html/src/html.ts).

## Default filters

Filters can also have a default value, this is useful when the filter should
normally be applied when locating the element, but there might be exceptions.
For example, the `TextField` interactor has a filter named `disabled` which is
applied by default.  Normally, disabled text fields should not be interacted
with. But sometimes you want to locate a disabled field to make assertions
about it.

So supposing we have a disabled text field like this:

```html
<label>
  Username
  <input disabled type='text' value="taylor365" id='username-id'/>
</label>
```

If we want to check the disabled field's value, the following fill fail:

```js
await TextField('Username').has({ value: 'taylor365' });
```

The text field will not be located, since it is disabled, and the default value
of the `disabled` filter is `false`. Instead we can do this:

```js
await TextField('Username', { disabled: true }).has({ value: 'taylor365' });
```

This will override the default filter value and locate the disabled text field.
