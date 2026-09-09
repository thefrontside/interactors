import { compile } from "@interactors/cli";
import { chromium } from "playwright";
import { loadInteractors } from "../build/npm/esm/mod.js";
import type * as Definitions from "./fixtures/index.ts";

Deno.test("compiled Interactors run through a real Playwright page", async () => {
  let directory = await Deno.makeTempDir();
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;

  try {
    browser = await chromium.launch({ headless: true });
    await compile({
      entrypoint: new URL("./fixtures/index.ts", import.meta.url).pathname,
      outdir: directory,
    });

    let page = await browser.newPage();
    await page.goto(htmlPage(`
      <label for="Email">Email</label>
      <form id="profile">
        <input id="Email" />
      </form>
    `));
    let ui = await loadInteractors<typeof Definitions>({ page, directory });

    // This first call uses the agent evaluated into the current document.
    await ui.TextField("Email").fillIn("jonas@example.com");
    await ui.TextField(ui.matching(/mail/i)).has({
      value: "jonas@example.com",
    });
    await ui.TextField(ui.sameLength("Other")).exists();
    await ui.Form("profile").find(
      ui.TextField({ disabled: false }),
    ).has({ value: ui.including("@example.com") });

    // This call uses the init script after a navigation.
    await page.goto(htmlPage(`<input id="Name" />`));
    await ui.TextField("Name").fillIn("after navigation");
    await ui.TextField("Name").has({ value: "after navigation" });
  } finally {
    try {
      await browser?.close();
    } finally {
      await Deno.remove(directory, { recursive: true });
    }
  }
});

function htmlPage(body: string): string {
  return `data:text/html;charset=utf-8,${
    encodeURIComponent(`<!doctype html><html><body>${body}</body></html>`)
  }`;
}
