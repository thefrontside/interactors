---
id: locators-filters-actions
title: Locators, Filters, and Actions
---

Whether they are predefined or written by you, all interactors have some things in common. They have to be able to find elements in the page and manipulate them like a user would. To do these things, Interactors use a locator, filters, and actions.

## The Locator

One benefit of Interactors is that they help you align your tests with how a user actually interacts with the app, starting with finding what to act upon. A locator is the simplest way to find a specific element in a user interface.

When you use an Interactor in a test, you can pass it a string or a regular expression. This argument would be the Locator - like for "Submit" in the examples below:

```js
Button('Submit').exists(); // string
Button(/Submit/).exists(); // regex
```

A typical user identifies a button by the words printed across it, so in this example they would consider a button with the word 'Submit' on it as the "Submit" button. Interactors use locators to make that connection.

What is going on behind the scenes? Just like the user, the predefined Button interactor looks for a button with "Submit" on it. It uses [element.innerText](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/button.ts#L11) to find the match. Or to put it another way, `Button('Submit')` returns a button element whose `element.innerText` is equal to `Submit`.

### The locator is optional

Sometimes, there may be only one element that matches an interactor. In those cases, you could omit the locator.

For example, if there was only one button rendered in a test, you could reference it like this:

```js
Button().exists();
```

However, calling an interactor will return an array of all of the matching elements and you will get an error if there are two or more matches. So if there were multiple buttons, you would need to use a locator to distinguish between them – or use filters.

## Filters

Another way of narrowing down the element that you want to reference is with filters. Filters are an object passed to an interactor, like the object with `id` in the example below:

```js
TextField('Username:', { id: 'username-id' }).exists();
```

:::note How is the textfield located?
The locator of the `TextField` interactor is the `innerText` of its associated label:

```html
<label>
  Username:
  <input type='text' id='username-id'/>
</label>
```

_This is just the way the predefined TextField interactor is configured. It is possible to modify pre-existing interactors such as this TextField interactor or create your own interactors from scratch to suit your needs. We will be going over how you can do all of this on the [Writing Interactors](/docs/write-your-own) page._
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
TextField({ id: 'username-id' }).exists();
TextField({ placeholder: 'PASSWORD' }).exists();
```

The filter object can take as many properties as you want it to:

```js
TextField({ id: 'username-id', placeholder: 'USERNAME', visible: true }).exists();
```

The filters available are defined by each interactor, so look at the source code for the predefined interactors to know what is available. For example, if you take a look at the [TextField source code](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/text-field.ts), you'll see that the TextField interactor provides two filters. In addition, TextField inherits all of the properties of the [FormField interactor](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/form-field.ts) and [HTML interactor](https://github.com/thefrontside/interactors/blob/main/packages/html/src/definitions/html.ts).

## Actions

Now that we’ve covered how you select the element you want to interact with, let’s actually interact with it. Interactors come with actions that you can perform on them. The actions are what a user can usually do: `click`, `focus`, `fillIn`, much like in any other testing library. However, Interactors also allow you to define actions for your components as your user would think of them, like `closeModal` or `toggleMenu`.

Let’s go back to our Button example from the beginning of this page, but now instead of just referring to it, let’s click it:

```js
Button('Submit').click();
```

It’s that simple! Because Interactors can only match one element, there’s no ambiguity over which submit button you clicked. Additionally, the action will not occur if the Interactor is not there, so you don’t have to worry about checking if the button exists before issuing a click action.

## Up Next

Locators, filters, and actions can be convenient for finding and interacting with matching UI elements, but where they really shine is in making assertions about what you expect your application to be showing.

In the next page, [Assertions](/docs/assertions), we will go over the different assertion methods and explore how you can use filters to make assertions.