import { test, Page, HTML, Link } from "bigtest";
import { Button as Interactor, including, not, or } from "../src/index";
import { Button as MuiButton } from "@material-ui/core";
import { containing } from './matchers';
import { render, buttonClasses } from "./helpers";

const button = Interactor();

const Span = HTML.extend('span').selector('span');

export default test("Button")
  .step(Page.visit("/"))
  .child("rendering a button", (test) => test
    .step("render button", async() => {
      await render(<MuiButton>My Button</MuiButton>)
    })
    .assertion(button.exists())
    .assertion(button.has({ text: "My Button".toUpperCase()}))

    .assertion("should render with the root, text and textPrimary classes but no others", async() => {
    await button.has({ classList: containing([buttonClasses.root, buttonClasses.text]) })
    await button.has({ classList: not(containing([buttonClasses.textSecondary, buttonClasses.outlined, buttonClasses.contained])) })
    })
  )
  .child('render a text secondary button', (test) => test
    .step("render secondary button", async() =>{
      await render(<MuiButton color="secondary">Secondary Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root)}))
    .assertion(button.has({ className: including(buttonClasses.text)}))
    .assertion(button.has({ className: not(including(buttonClasses.contained))}))
    .assertion(button.has({ className: not(including(buttonClasses.textPrimary))}))
  )
  .child('render outline button', (test) => test
    .step('outline button', async() => {
      await render(<MuiButton variant="outlined">Outlined Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.outlined) }))
    .assertion(button.has({ className: not(including(buttonClasses.text)) }))
    .assertion(button.has({ className: not(including(buttonClasses.contained)) }))
  )
  .child('render primary outlined variant', (test) => test
    .step('outlined primary variant', async() => {
      await render(<MuiButton variant="outlined" color="primary">Primary Outlined</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.outlined)}))
    .assertion(button.has({ className: including(buttonClasses.outlinedPrimary)}))
  )
  .child('render secondary outlined variant', (test) => test
    .step('outlined secondary variant', async() => {
      await render(<MuiButton variant="outlined" color="secondary">Secondary Outlined</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.outlined)}))
    .assertion(button.has({ className: including(buttonClasses.outlinedSecondary)}))
  )
  .child('render inherit outlined variant', (test) => test
    .step('inherit outlined variant button', async() => {
      await render(<MuiButton variant="outlined" color="inherit">Inherit Outline</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root) }))
    .assertion(button.has({ className: including(buttonClasses.outlined) }))
    .assertion(button.has({ className: including(buttonClasses.colorInherit) }))
    .assertion(button.has({ className: not(including(buttonClasses.text)) }))
    .assertion(button.has({ className: not(including(buttonClasses.textSecondary)) }))
    .assertion(button.has({ className: not(including(buttonClasses.contained)) }))
  )

  .child('renders a contained button', (test) => test
    .step('render a contained button', async() => {
      await render(<MuiButton variant="contained">Contained Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root) }))
    .assertion(button.has({ className: including(buttonClasses.contained) }))
    .assertion(button.has({ className: not(including(buttonClasses.textPrimary)) }))
    .assertion(button.has({ className: not(including(buttonClasses.textSecondary)) }))
  )
  .child('renders a contained primary button', (test) => test
    .step('render a contained primary button', async() => {
      await render(<MuiButton variant="contained" color="primary">Contained Primary Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root) }))
    .assertion(button.has({ className: including(buttonClasses.contained) }))
    .assertion(button.has({ className: including(buttonClasses.containedPrimary) }))
    .assertion(button.has({ className: not(including(buttonClasses.text)) }))
    .assertion(button.has({ className: not(including(buttonClasses.containedSecondary)) }))
  )
  .child('renders a contained secondary button', (test) => test
    .step('render a contained secondary button', async() => {
      await render(<MuiButton variant="contained" color="secondary">Contained Secondary Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root) }))
    .assertion(button.has({ className: including(buttonClasses.contained) }))
    .assertion(button.has({ className: including(buttonClasses.containedSecondary) }))
    .assertion(button.has({ className: not(including(buttonClasses.text)) }))
    .assertion(button.has({ className: not(including(buttonClasses.containedPrimary)) }))
  )
  .child('renders a small text button', (test) => test
    .step('render a small text button', async() => {
      await render(<MuiButton size="small">Small Text Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root) }))
    .assertion(button.has({ className: including(buttonClasses.text) }))
    .assertion(button.has({ className: including(buttonClasses.textSizeSmall) }))
    .assertion(button.has({ className: not(including(buttonClasses.textSizeLarge)) }))
    .assertion(button.has({ className: not(including(buttonClasses.outlinedSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.outlinedSizeLarge)) }))
    .assertion(button.has({ className: not(including(buttonClasses.containedSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.containedSizeLarge)) }))
  )
  .child('renders a large text button', (test) => test
    .step('render a large text button', async() => {
      await render(<MuiButton size="large">Large Text Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root) }))
    .assertion(button.has({ className: including(buttonClasses.text) }))
    .assertion(button.has({ className: including(buttonClasses.textSizeLarge) }))
    .assertion(button.has({ className: not(including(buttonClasses.textSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.outlinedSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.outlinedSizeLarge)) }))
    .assertion(button.has({ className: not(including(buttonClasses.containedSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.containedSizeLarge)) }))
  )
  .child('renders a small outlined button', (test) => test
    .step('render a small outlined button', async() => {
      await render(<MuiButton variant="outlined" size="small">Small outlined Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root) }))
    .assertion(button.has({ className: including(buttonClasses.outlined) }))
    .assertion(button.has({ className: including(buttonClasses.outlinedSizeSmall) }))
    .assertion(button.has({ className: not(including(buttonClasses.textSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.outlinedSizeLarge)) }))
    .assertion(button.has({ className: not(including(buttonClasses.containedSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.containedSizeLarge)) }))
  )
  .child('renders a large outlined button', (test) => test
    .step('render a large outlined button', async() => {
      await render(<MuiButton variant="outlined" size="large">Large outlined Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root) }))
    .assertion(button.has({ className: including(buttonClasses.outlined) }))
    .assertion(button.has({ className: including(buttonClasses.outlinedSizeLarge) }))
    .assertion(button.has({ className: not(including(buttonClasses.textSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.textSizeLarge)) }))
    .assertion(button.has({ className: not(including(buttonClasses.outlinedSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.containedSizeLarge)) }))
    .assertion(button.has({ className: not(including(buttonClasses.containedSizeSmall)) }))
  )
  .child('renders a small contained button', (test) => test
    .step('render a small contained button', async() => {
      await render(<MuiButton variant="contained" size="small">Small contained Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root) }))
    .assertion(button.has({ className: including(buttonClasses.contained) }))
    .assertion(button.has({ className: including(buttonClasses.containedSizeSmall) }))
    .assertion(button.has({ className: not(including(buttonClasses.textSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.textSizeLarge)) }))
    .assertion(button.has({ className: not(including(buttonClasses.outlinedSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.outlinedSizeLarge)) }))
    .assertion(button.has({ className: not(including(buttonClasses.containedSizeLarge)) }))
  )
  .child('renders a large contained button', (test) => test
    .step('render a large contained button', async() => {
      await render(<MuiButton variant="contained" size="small">Large contained Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root) }))
    .assertion(button.has({ className: including(buttonClasses.contained) }))
    .assertion(button.has({ className: including(buttonClasses.containedSizeSmall) }))
    .assertion(button.has({ className: not(including(buttonClasses.textSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.textSizeLarge)) }))
    .assertion(button.has({ className: not(including(buttonClasses.outlinedSizeSmall)) }))
    .assertion(button.has({ className: not(including(buttonClasses.outlinedSizeLarge)) }))
    .assertion(button.has({ className: not(including(buttonClasses.containedSizeLarge)) }))
  )
  .child('renders button with startIcon', (test) => test
    .step('render startIcon Button', async() => {
      await render(<MuiButton startIcon={<span>icon</span>}>StartIcon Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root) }))
    .assertion(button.has({ className: including(buttonClasses.text) }))
    .assertion(button.has({ iconLabel: including(buttonClasses.startIcon) }))
    .assertion(button.has({ iconLabel: not(including(buttonClasses.endIcon)) }))
  )
  .child('renders button with endIcon', (test) => test
    .step('render endIcon Button', async() => {
      await render(<MuiButton endIcon={<span>icon</span>}>EndIcon Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.root) }))
    .assertion(button.has({ className: including(buttonClasses.text) }))
    .assertion(button.has({ iconLabel: including(buttonClasses.endIcon) }))
    .assertion(button.has({ iconLabel: not(including(buttonClasses.startIcon)) }))
  )
  .child('button renders with ripple by default', (test) => test
    .step('render button with ripple', async() => {
      await render(<MuiButton TouchRippleProps={{ className: 'touch-ripple'}}>Ripple Button</MuiButton>)
    })
    .step('has root span with custom css ripple', async() => {
      await button.find(Span({ className: including('touch-ripple')})).exists()
    })
  )
  .child('can disable ripple effect', (test) => test
    .step('render button disabled ripple', async() => {
      await render(<MuiButton disableRipple TouchRippleProps={{ className: 'touch-ripple'}}>Ripple Button</MuiButton>)
    })
    .step('span with custom ripple class', async() => {
      await button.find(Span({ className: including('touch-ripple')})).absent()
    })
  )
  .child('can disable elevation', (test) => test
    .step('render button with disabled elevation', async() => {
      await render(<MuiButton disableElevation>Disabled Elevation Button</MuiButton>)
    })
    .assertion(button.has({ className: including(buttonClasses.disableElevation) }))
  )
  .child('have a focusRipple by default', (test) => test
    .step('render button', async() => {
      await render(<MuiButton TouchRippleProps={{ classes: { ripplePulsate: 'pulstat-focus-visible'} }}>Focus ripple default button</MuiButton>)
    })
    .step('focus button', async() => {
      await button.focus()
    })
    .step('has span with css ripple', async() => {
      await button.find(Span({ className: including('pulstat-focus-visible')})).exists()
    })
  )
  .child('can disable focusRipple', (test) => test
    .step('render button', async() => {
      await render(
        <MuiButton
          disableFocusRipple
          TouchRippleProps={{ classes: { ripplePulsate: 'pulstat-focus-visible'} }}
        >
          Focus ripple disabled button
        </MuiButton>
      )
    })
    .step('focus button', async() => {
      await button.focus()
    })
    .step('should not have visible css ripple', async() => {
      await button.find(Span({ className: including('pulstat-focus-visible')})).absent();
    })
  )
  .child('should automatically change button to an anchor when href is provided', (test) => test
    .step('render button with href', async() => {
      await render(<MuiButton href="https://google.com">Href Button</MuiButton>)
    })
    /**
     * When a href is passed to the Material Button it will render <a> tag so
     * we will switch to use a built-in Link Interactor.
     */
    .assertion(Link().has(
     {
        className: including(buttonClasses.root),
        href: including("https://google.com")
      }
    ))
  )
  .child('should forward classes to BaseButton', (test) => test
    .step('render button', async() => {
      await render(<MuiButton disabled classes={{ disabled: 'disabledClassName' }}>Disabled Button</MuiButton>)
    })
    // .step('button is disabled and styles passed to BaseButton', async() => {
    //   const { container } = render(<MuiButton disabled classes={{ disabled: 'disabledClassName' }} />)
    //   console.log(container.querySelector('button'))
    //   await container.querySelector('button')?.classList.contains('disabledClassName')
    // })
    //TODO: fix this assertion to use bigTest methods
    .assertion(button.has({ className: including('disabledClassName') }))
  )