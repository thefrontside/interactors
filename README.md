# Interactors

[![Github Actions](https://github.com/thefrontside/interactors/actions/workflows/test.yml/badge.svg)](https://github.com/thefrontside/interactors/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Created by Frontside](https://img.shields.io/badge/created%20by-frontside-26abe8.svg)](https://frontside.com)
[![Chat on Discord](https://img.shields.io/discord/700803887132704931?Label=Discord)](https://discord.gg/mv4uxxcAKd)

Interactors are Page Objects for component libraries and design systems. Learn more at [http://frontside.com/interactors](https://frontside.com/interactors)

* **Blackbox made easy:** Interactors manipulate an HTML interface from the perspective of a user and make no assumptions about the internal workings of an app. This means they cover 100% of your UI code starting from the raw input event handlers.
* **Remarkably diagnostic errors:** Because they are strongly associated with both the type and properties of the UI elements they actuate (e.g. Button, Checkbox, Input, ...), they quickly provide the next level in error messaging to help you quickly understand not just that something went wrong, but _why_.
* **Runner-agnostic:** They work well in any modern test runner capable of evaluating JavaScript in the context of the DOM. including both `Jest` and `Cypress`.
* **Framework-agnostic** Your tests will work the same no matter if your application is written in React, Angular, Vue, or whether you choose to eventually rewrite it in Framework 2043.™
* **Fast and precise:** By using its unique [convergence strategy](https://frontside.com/blog/2020-07-16-the-lesson-of-bigtest-interactors/#the-convergence-strategy) and only coupling wait times to observable states, Interactors naturally use the minimum amount of synchronization time while performing actions and assertions.
