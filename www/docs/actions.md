---
id: actions
title: Actions
---

Actions are the core of interactors. They manipulate your application and
simulate how a user behaves as they use it.

## Actions

Interactors define actions that you can perform on them. The actions are what a
user can usually do: `click`, `focus`, `fillIn`, much like in any other testing
library. However, Interactors also allow you to define actions for your
components as your user would think of them, like `closeModal` or `toggleMenu`.

Let’s go back to our Button example from before, but now instead of just
referring to it, let’s click it:

```js
await Button('Submit').click();
```

Because Interactors can only match one element, there’s no ambiguity over which
submit button you clicked. Additionally, the action will throw an error if the
Interactor is not there, so you don’t have to worry about checking if the
button exists before issuing a click action.

## Arguments

Some actions, such as `fillIn`, can take arguments. For example when filling in
a text field, we need to specify the value that we want to fill in:

```js
await TextField('Name').fillIn('Jonas');
```

## Waiting

A common problem when testing interactive UIs is that an element that you want
to interact with is not ready yet. Maybe you're waiting for a request to the
server, which would render the element. Most testing libraries include some
kind of `waitFor` function which waits for the element to appear before
proceeding. When designing interactors, we took great care to ensure that you
will never need to call `waitFor`, and in fact interactors does not include such
a function.

Let's imagine our submit button is not shown yet and will only appear after a
short period of time. Remember, this is how we would click on the submit
button:

```js
await Button('Submit').click();
```

And this is how we would click on the submit button if it does not exist yet
and appears after a short while:

```js
await Button('Submit').click();
```

As you can see, it's the same! We didn't need to do anything! The secret is
that all actions *always* wait for the element to appear if it has not appeared
yet. Any actions will be retried again and again, until the element exists.
After a certain while, interactors give up and the action times out. The duration
of the timeout is [configurable](/docs/configuration#timeout).

We have designed interactors very carefully to enable you to write rock solid
tests which never fail randomly. This mechanism is the same underlying
mechanism which is used by the popular acceptance testing framework
[Capybara](https://github.com/teamcapybara/capybara), which is known for
producing very solid tests.

## Perform

There are some cases where the actions that the interactor provides aren't enough,
and you want to do some custom manipulation on an element. Interactors do not
give you direct access to the element, but you can use the `perform` method as an
escape hatch in case you need to do something like this:

```js
await Button('Submit').perform((element) => element.form.submit());
```

This also has the same waiting behaviour as other actions. `perform` also plays an
important role when defining your own [actions on interactors](./create-actions).
