# Interactors

[![CircleCI](https://circleci.com/gh/thefrontside/interactors.svg?style=shield)](https://circleci.com/gh/thefrontside/interactors)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Created by Frontside](https://img.shields.io/badge/created%20by-frontside-26abe8.svg)](https://frontside.com)
[![Chat on Discord](https://img.shields.io/discord/700803887132704931?Label=Discord)](https://discord.gg/Ug5nWH8)

Interactors is a library designed to help you write UI tests from the outside in that are both efficient and valuable.

Interactors manipulate an HTML interface from the perspective of a user and make no assumptions about the internal workings of an app. This means they cover 100% of your UI code starting from the raw input event handlers. Your tests will work the same no matter if your application is written in React, Angular, Vue, or whether you chose to eventually rewrite it in Framework 2043.™

Not only are Interactors valuable, but they’re fast and precise too. By using its unique [convergence strategy](https://frontside.com/blog/2020-07-16-the-lesson-of-bigtest-interactors/#the-convergence-strategy) and only coupling wait times to observable states, Interactors naturally use the minimum amount of synchronization time while performing actions and assertions. Because they are strongly associated with both the type and properties of the UI elements they actuate (e.g. Button, Checkbox, Input, ...), they quickly provide the next level in error messaging when something goes wrong or an assertion fails.
