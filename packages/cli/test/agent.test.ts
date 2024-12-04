import { afterEach, beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { type Browser, chromium } from "playwright";
import { HTML as $HTML } from "@interactors/html";
import { Ok } from "effection";

const HTML = $HTML.builder((i) => i);

let browser: Browser;
let agent = {
  run: async (_i: unknown) => Ok<void>(void(0)),
};

describe("Interactor Agent", () => {
  beforeEach(async function () {
    browser = await chromium.launch();
    const context = await browser.newContext();
    await context.addInitScript({ path: "./build/agent.js" });
    const page = await context.newPage();
    const url = new URL("./agent.test.html", import.meta.url);
    await page.goto(String(url));
    // deno-lint-ignore require-await
    agent.run = async (i) =>
      page.evaluate(
        ({ interaction }) => {
	  //@ts-expect-error this is running on the browser, so it would be an error locally.
          return globalThis.interactorAgent.run(interaction);
        },
        { interaction: JSON.parse(JSON.stringify(i)) },
      );
  });

  afterEach(async function () {
    await browser.close();
  });

  it("can recognize HTML", async function () {
    const interaction = HTML("Hello world! This is HTML5 Boilerplate.")
      .exists();
    let result = await agent.run(interaction);
    expect(result).toEqual({ ok: true });
    expect(await agent.run(HTML("This text is nowhere").exists()))
      .toMatchObject({ ok: false });
  });

  it("fails if a thing cannot be found", async function () {
    const result = await agent.run(HTML("This is nowhere").exists());
    expect(result.ok).toBeFalsy();
    expect(await agent.run(HTML("This is nowhere").absent())).toEqual({
      ok: true,
    });
  });

  it("can call nested interactors", async function () {
    const interaction = HTML({ title: "greeting" })
      .find(HTML("Hello world! This is HTML5 Boilerplate."))
      .exists();
    const result = await agent.run(interaction);
    expect(result).toEqual({ ok: true });
  });

  it("can make assertions based an attributes", async function () {
    expect(
      await agent.run(
        HTML({ id: "hello" }).has({
          text: "Hello world! This is HTML5 Boilerplate.",
          id: "hello",
        }),
      ),
    ).toEqual({ ok: true });
    expect(
      await agent.run(HTML({ id: "hello" }).has({ text: "Goodbye world!" })),
    ).toMatchObject({
      ok: false,
    });
  });

  // it('can make assertions based on matchers', async function () {

  //   expect(await agent.run(HTML({ id: matching(/hel/) }).has({ text: matching(/Hello world!/) }))).toEqual({
  //     ok: true
  //   });
  // });

  it.skip("can validate that a set of interactions can be run ahead of time", () => {});
});
