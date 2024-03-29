---
id: matchers
title: Matchers
---

Here, we will do a deep dive on how you can utilize matchers that are offered out-of-the-box in Interactors, and also go over how you can compose your own reusable matchers.

## Writing flexible assertions using Matchers

Matchers are methods that let you add logic or flexibility when you are searching for elements. They can be used within locators, filters, and assertions. In this section, you will learn how to use matchers to write better tests.

Matchers include the following methods:

- Text flexibility like `including()` and `matching()`
- Conditionals like `and()`, `or()`, and `not()`
- Iterables like `some()` and `every()`

### When to use Matchers

If your tests are written against a simulated database, it might not be important what the randomized users' names are. Maybe you just want to assert that a login success message includes the word "welcome", such as "Welcome, Taylor!" Or perhaps it does not matter what the name is, but you still want to assert that a name is displayed. These are situations where matchers would come in handy.

### String matchers

The `including()` matcher invokes Javascript's `includes()` String method to check if the argument is included in the value of your interactors' locator or filter.

And `matching()` is for when you want to match against a regular expression instead of a string.

To demonstrate how you can use these two matchers, let's take this Heading element:

```html
<h1>Hello Taylor!</h1>
```

Here is how you would use `including()` and `matching()` to locate the header and assert that it exists:

```js
Heading(including('Hello')).exists();
Heading(matching(/^Hello \w+!$/)).exists();
```

### Conditional matchers

These next three matchers: `and()`, `or()`, and `not()` are different from the first two matchers in that they can take multiple arguments and the arguments can be either a value or another matcher.

For the next few examples, we'll be using these two link elements:

```html
<a href="https://google.com">Google</a>
<a href="https://twitter.com">Twitter</a>
```

Let's first see how you can combine `and()` with some of the other matchers. In this test we are checking to see if there is a link with a `href` property that starts with `https`, includes `google`, _and_ ends with `.com`:

```js
Link({
  href: and(
    matching(/^https/),
    including('google'),
    matching(/\.com$/)
  )
}).exists();
```

If there is no link that matches all three conditions, the test would fail on account of the interactor not returning any elements.

In this next example, we will pass in multiple TLDs to the `or()` matcher:

```js
Link('Google').has({
  href: or(
    'https://google.ca',
    'https://google.co.uk'
  )
});
```

If our Google link was `.ca` but we asserted that it was `.co.uk`, our test would fail. However, with the `or()` matcher, we can assert that it can be either `.ca` or `co.uk`.

And last but not least of the three is the `not()` matcher. This one is also pretty straight forward:

```js
Link('Google').has({ href: not(including('twitter')) });
```

### Iterable matchers

For when you need to assert against iterables, you will find the `some()` and `every()` matchers very helpful. We will use the [`MultiSelect`](https://github.com/thefrontside/interactors/blob/main/packages/html/src/multi-select.ts#L45) interactor for the next example because its `values` filter returns an array based on its options' label:

```js
.filters({
  values: (e) => Array.from(e.selectedOptions).map((o) => o.label),
})
```

`some()` matcher will return true if the argument matches any one of the array items, and `every()` will return true only if all items match. We will use the select element below to demonstrate how these two matchers work:

```html
<select multiple>
  <option selected>Neon Blue</option>
  <option selected>Neon Green</option>
</select>
```

In the following tests, we're going to first assert that _some_ of the select element's options has a value that includes the word "Blue", and then assert that _every_ option starts with "Neon":

```js
MultiSelect().has({ values: some(including('Blue')) });
MultiSelect().has({ values: every(matching(/^Neon/)) });
```

In the two tests above we are passing in the `including()` and `matching()` matchers into `some()` and `every()`. Once again, `and()`, `or()`, `not()`, `some()`, and `every()` can take matchers as its arguments. This means you can chain them together multiple times if you need to.

Though the matchers are already ergonomic, you can make your tests even tidier and easier to read by creating your own matchers. There are two ways you can write your own matcher: by piggybacking on preexisting matchers or you can create your own from scratch. We will cover both methods next.

## Composing matchers

We will first go over how you can compose matchers using preexisting matchers. Let us start by creating a matcher called `hasFoo`:

```js
import { including } from '@interactors/html';

export const hasFoo = including('Foo');
```

You can import and use the new matcher in your tests like so:

```js
Heading(hasFoo).exists()
```

You can compose a matcher using other matchers too. This is convenient because it delegates most of the matcher's logic as well as the error message. In the example below, you can see that we use `or`, `including`, and `every` to create a matcher for a MultiSelect.

```js
import { including, or } from '@interactors/html';

export const blueOrGreen = or(
  including('Blue'),
  including('Green')
);
```

```js
MultiSelect().has({ values: every(blueOrGreen) });
```

## Creating matchers from scratch

To create your own matcher without the use of any of the preexisting ones, you will need to create a function that returns a `{ match(), description() }` object.

The `match()` function returns a boolean value indicating whether a filter or locator matches. It takes a single argument, `actual`, which is the current value of the filter or locator. Here's how the `including()` matcher is implemented:

```js
export function including(subString) {
  return {
    match(actual) {
      return actual.includes(subString);
    },
    description() {
      return `including ${JSON.stringify(subString)}`;
    }
  };
};
```

And the return value from the `description()` function is to display an error message for when no interactors are found:

```
ERROR did not find heading with id including "foo" ...
```

Or for when an incorrect assertion is made:

```
ERROR heading does not match filters:

╒═ Filter:   id
├─ Expected: including "foo"
└─ Received: "bar"
```

Here is a simple example of how a `greaterThan()` matcher can be constructed:

```js
export function greaterThan(number) {
  return {
    match(actual) {
      return actual > number
    },
    description() {
      return `greater than ${number}`
    }
  };
};
```

This `greaterThan()` matcher will return true when the value of the relevant interactors' locator or filter is greater than the argument.
