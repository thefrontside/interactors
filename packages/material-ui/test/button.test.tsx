import { test } from "bigtest";
import { Button, including, not, Page, HTML } from "../src/index";
import { Button as Component } from "@material-ui/core";
import { createRenderStep } from "./helpers";
import { ComponentProps } from "react";

const renderButton = createRenderStep(Component, { children: 'My Button' });
const button = Button(including("My Button".toUpperCase()));

export default test("Button")
  .step(Page.visit("/"))
  .child("rendering a button", (test) => test
    .step(renderButton())
    .assertion(button.exists())
    .assertion(button.has({ text: "My Button".toUpperCase() }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-text") }))
    .assertion(button.has({ className: not(including("MuiButton-textSecondary")) }))
    .assertion(button.has({ className: not(including("MuiButton-outlined")) }))
    .assertion(button.has({ className: not(including("MuiButton-contained")) }))
  )
  .child('render a text secondary button', (test) => test
    .step(renderButton({ color: 'secondary' }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-text") }))
    .assertion(button.has({ className: not(including("MuiButton-contained")) }))
    .assertion(button.has({ className: not(including("MuiButton-textPrimary")) }))
  )
  .child('render outline button', (test) => test
    .step(renderButton({ variant: "outlined" }))
    .assertion(button.has({ className: including("MuiButton-outlined") }))
    .assertion(button.has({ className: not(including("MuiButton-text")) }))
    .assertion(button.has({ className: not(including("MuiButton-contained")) }))
  )
  .child('render primary outlined variant', (test) => test
    .step(renderButton({ variant: "outlined", color: "primary" }))
    .assertion(button.has({ className: including("MuiButton-outlined") }))
    .assertion(button.has({ className: including("MuiButton-outlinedPrimary") }))
  )
  .child('render secondary outlined variant', (test) => test
    .step(renderButton({ variant: "outlined", color: "secondary" }))
    .assertion(button.has({ className: including("MuiButton-outlined") }))
    .assertion(button.has({ className: including("MuiButton-outlinedSecondary") }))
  )
  .child('render inherit outlined variant', (test) => test
    .step(renderButton({ variant: "outlined", color: "inherit" }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-outlined") }))
    .assertion(button.has({ className: including("MuiButton-colorInherit") }))
    .assertion(button.has({ className: not(including("MuiButton-text")) }))
    .assertion(button.has({ className: not(including("MuiButton-textSecondary")) }))
    .assertion(button.has({ className: not(including("MuiButton-contained")) }))
  )

  .child('renders a contained button', (test) => test
    .step(renderButton({ variant: "contained" }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-contained") }))
    .assertion(button.has({ className: not(including("MuiButton-textPrimary")) }))
    .assertion(button.has({ className: not(including("MuiButton-textSecondary")) }))
  )
  .child('renders a contained primary button', (test) => test
    .step(renderButton({ variant: "contained", color: "primary" }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-contained") }))
    .assertion(button.has({ className: including("MuiButton-containedPrimary") }))
    .assertion(button.has({ className: not(including("MuiButton-text")) }))
    .assertion(button.has({ className: not(including("MuiButton-containedSecondary")) }))
  )
  .child('renders a contained secondary button', (test) => test
    .step(renderButton({ variant: "contained", color: "secondary" }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-contained") }))
    .assertion(button.has({ className: including("MuiButton-containedSecondary") }))
    .assertion(button.has({ className: not(including("MuiButton-text")) }))
    .assertion(button.has({ className: not(including("MuiButton-containedPrimary")) }))
  )
  .child('renders a small text button', (test) => test
    .step(renderButton({ size: "small" }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-text") }))
    .assertion(button.has({ className: including("MuiButton-textSizeSmall") }))
    .assertion(button.has({ className: not(including("MuiButton-textSizeLarge")) }))
    .assertion(button.has({ className: not(including("MuiButton-outlinedSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-outlinedSizeLarge")) }))
    .assertion(button.has({ className: not(including("MuiButton-containedSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-containedSizeLarge")) }))
  )
  .child('renders a large text button', (test) => test
    .step(renderButton({ size: "large" }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-text") }))
    .assertion(button.has({ className: including("MuiButton-textSizeLarge") }))
    .assertion(button.has({ className: not(including("MuiButton-textSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-outlinedSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-outlinedSizeLarge")) }))
    .assertion(button.has({ className: not(including("MuiButton-containedSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-containedSizeLarge")) }))
  )
  .child('renders a small outlined button', (test) => test
    .step(renderButton({ variant: "outlined", size: "small" }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-outlined") }))
    .assertion(button.has({ className: including("MuiButton-outlinedSizeSmall") }))
    .assertion(button.has({ className: not(including("MuiButton-textSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-outlinedSizeLarge")) }))
    .assertion(button.has({ className: not(including("MuiButton-containedSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-containedSizeLarge")) }))
  )
  .child('renders a large outlined button', (test) => test
    .step(renderButton({ variant: "outlined", size: "large" }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-outlined") }))
    .assertion(button.has({ className: including("MuiButton-outlinedSizeLarge") }))
    .assertion(button.has({ className: not(including("MuiButton-textSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-textSizeLarge")) }))
    .assertion(button.has({ className: not(including("MuiButton-outlinedSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-containedSizeLarge")) }))
    .assertion(button.has({ className: not(including("MuiButton-containedSizeSmall")) }))
  )
  .child('renders a small contained button', (test) => test
    .step(renderButton({ variant: "contained", size: "small" }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-contained") }))
    .assertion(button.has({ className: including("MuiButton-containedSizeSmall") }))
    .assertion(button.has({ className: not(including("MuiButton-textSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-textSizeLarge")) }))
    .assertion(button.has({ className: not(including("MuiButton-outlinedSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-outlinedSizeLarge")) }))
    .assertion(button.has({ className: not(including("MuiButton-containedSizeLarge")) }))
  )
  .child('renders a large contained button', (test) => test
    .step(renderButton({ variant: "contained", size: "small" }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-contained") }))
    .assertion(button.has({ className: including("MuiButton-containedSizeSmall") }))
    .assertion(button.has({ className: not(including("MuiButton-textSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-textSizeLarge")) }))
    .assertion(button.has({ className: not(including("MuiButton-outlinedSizeSmall")) }))
    .assertion(button.has({ className: not(including("MuiButton-outlinedSizeLarge")) }))
    .assertion(button.has({ className: not(including("MuiButton-containedSizeLarge")) }))
  )
  .child('renders button with startIcon', (test) => test
    .step(renderButton({ startIcon: <span>icon</span> }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-text") }))
    .assertion(button.find(HTML({ className: including("MuiButton-startIcon") })).exists())
    .assertion(button.find(HTML({ className: not(including("MuiButton-endIcon")) })).exists())
  )
  .child('renders button with endIcon', (test) => test
    .step(renderButton({ endIcon: <span>icon</span> }))
    .assertion(button.has({ className: including("MuiButton-root") }))
    .assertion(button.has({ className: including("MuiButton-text") }))
    .assertion(button.find(HTML({ className: including("MuiButton-endIcon") })).exists())
    .assertion(button.find(HTML({ className: not(including("MuiButton-startIcon")) })).exists())
  )
  .child('button renders with ripple by default', (test) => test
    .step(renderButton({ TouchRippleProps: { className: 'touch-ripple' } }))
    .assertion(button.find(HTML({ className: including('touch-ripple') })).exists())
  )
  .child('can disable ripple effect', (test) => test
    .step(renderButton({ disableRipple: true, TouchRippleProps: { className: 'touch-ripple' } }))
    .assertion(button.find(HTML({ className: including('touch-ripple') } )).absent())
  )
  .child('can disable elevation', (test) => test
    .step(renderButton({ disableElevation: true }))
    .assertion(button.has({ className: including("MuiButton-disableElevation") }))
  )
  .child('have a focusRipple by default', (test) => test
    .step(renderButton({ TouchRippleProps: { classes: { ripplePulsate: 'pulstat-focus-visible' } } }))
    .step(button.focus())
    .assertion(button.find(HTML({ className: including("pulstat-focus-visible") } )).exists())
  )
  .child('can disable focusRipple', (test) => test
    .step(
      renderButton({
        disableFocusRipple: true,
        TouchRippleProps: { classes: { ripplePulsate: 'pulstat-focus-visible' } }
      })
    )
    .step(button.focus())
    .assertion(button.find(HTML({ className: including("MuiTouchRipple-rippleVisible") })).absent())
  )
  .child('should automatically change button to an anchor when href is provided', (test) => test
    .step(renderButton({ href: "https://google.com" }))
    .assertion(button.has(
     {
        className: including("MuiButton-root"),
        href: including("https://google.com")
      }
    ))
  )
  .child('should forward classes to BaseButton', (test) => test
    .step(renderButton({ disabled: true, classes: { disabled: "disabledClassName" } }))
    .assertion(Button({ disabled: true }).has({ className: including("disabledClassName"), disabled: true }))
  )
  .child('renders button as a span with [role="button"]', (test) => test
    .step(renderButton({ component: 'span' } as ComponentProps<typeof Component>))
    .assertion(button.exists())
    .assertion(HTML.selector('span')({ className: including('MuiButton-root') }).exists())
  );
