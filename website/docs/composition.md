---
id: composition
title: "Composition"
---

One of the strengths of interactors is that they are composable, this allows you to
give context to an interaction.

## Find

To compose interactors, we use the `find` method. Suppose you want to fill out an address
and want to fill in the city you live in into the corresponding field:

``` js
await TextField("City").fillIn("Toronto");
```

But maybe the form we have has separate fields for the shipping address and the
delivery address.  Like we've noted before, if there are multiple elements
which match an interactor and we perform an action, then we will get an error.
Actions need to be unambiguous. So to successfully fill in the City field, we
need to specify which address we're referring to.

Usually in our HTML code, we would use the `<fieldset>` tag to group a number
of fields like our shipping and delivery addresses. Our markup could look
something like this:

``` html
<fieldset>
  <legend>Shipping Address</legend>

  <p>
    <label for="shipping_address_city">City</label>
    <input id="shipping_address_city" type="text"/>
  </p>
</fieldset>

<fieldset>
  <legend>Delivery Address</legend>

  <p>
    <label for="delivery_address_city">City</label>
    <input id="delivery_address_city" type="text"/>
  </p>
</fieldset>
```

Of course we could use the `id` of the `input` tags to specify which input we mean:

``` js
await TextField({ id: "shipping_address_city" }).fillIn("Toronto");
```

But remember that interactors are supposed to test your application as your
*user* sees it, and your user doesn't really know anything about the `id` of the
field.

Instead we can use the `FieldSet("Shipping Address")` interactor to specify
which fieldset we want to interact with, and use the `find` method to compose
these two interactors:

``` js
await FieldSet("Shipping Address").find(TextField('City')).fillIn('Toronto');
```

Here `find` returns a new interactor which first looks for a fieldset with the
legend "Shipping Address", and then within that fieldset tries to find a text
field with the label "City". The interactor returned by `find` has the same actions
and filters as the text field that we passed as an argument, so we can call the
`fillIn` action from the `TextField` interactor on the result!

## Taking it further

With `find` we can compose interactors on the fly, but when you are creating your
own interactors, there are many more ways to reuse and compose interactors to create
complex interactions and simplify common tasks. Check out our guides on defining [locators](/docs/create-locator),
[filters](/docs/create-filters) and [actions](/docs/create-actions) for more information.

## Waiting

You might be worried that composing interactors this way would have an effect
on the waiting behaviour that we talked about when discussing
[Actions](./actions), but there is no need to be concerned. Composed
interactors use the same waiting strategy, and they will retry the whole chain
of interactors, so that when something changes on the page, those changes don't
cause interactors further down the chain to fail.
