import { expect } from "@std/expect";
import { compile } from "@interactors/cli";

Deno.test("generated declarations retain the remote Playwright API types", async () => {
  let temporary = await Deno.makeTempDir({
    dir: new URL(".", import.meta.url).pathname,
    prefix: ".types-test-",
  });
  let outdir = `${temporary}/dist`;
  let consumer = `${temporary}/consumer.ts`;

  try {
    await compile({
      entrypoint: new URL("./fixtures/index.ts", import.meta.url).pathname,
      outdir,
    });
    await Deno.writeTextFile(
      consumer,
      `import type * as Definitions from "./dist/interactors.d.ts";
import type {
  RemoteDefinitions,
  RemoteInput,
  RemoteMatcher,
} from "../../mod.ts";

declare const ui: RemoteDefinitions<typeof Definitions>;

const field = ui.TextField(ui.matching(/^Email$/), {
  disabled: ui.not(true),
  value: ui.and(ui.including("@"), ui.sameLength("a@b")),
});
const nested = ui.Form("signup").find(field);
const action: Promise<void> = nested.fillIn("a@b");
await nested.has({ value: ui.sameLength("a@b") });

ui.TextField({ value: ui.matching(/ready/i), disabled: false });
ui.MultiSelect({ values: ui.some(ui.including("Neon")) });

declare const broadMatcher: RemoteMatcher<string | number>;
const stringMatcher: RemoteMatcher<string> = broadMatcher;

// @ts-expect-error fillIn accepts a string
nested.fillIn(42);
// @ts-expect-error value is a string filter
ui.TextField({ value: 42 });
// @ts-expect-error including() matches strings, not booleans
ui.TextField({ disabled: ui.including("yes") });
// @ts-expect-error sameLength accepts a string
ui.sameLength(3);
// @ts-expect-error find() takes an instantiated remote interactor
ui.Form().find(ui.TextField);
// @ts-expect-error builder methods are not remote methods
ui.TextField.selector("input");
// @ts-expect-error callback APIs cannot cross the page boundary
field.perform(() => undefined);
// @ts-expect-error filters must be asserted with has() or is()
nested.value();
// @ts-expect-error filters must be asserted with has() or is()
nested.disabled();
// @ts-expect-error wire-tagged objects are reserved for the adapter protocol
const reservedWireObject: RemoteInput<{ $type: string; value: string }> = {
  $type: "custom",
  value: "ready",
};
// @ts-expect-error matchers are contravariant in the values they can accept
const broadFromNarrow: RemoteMatcher<string | number> = ui.including("ready");

void action;
void stringMatcher;
void reservedWireObject;
void broadFromNarrow;
`,
    );

    let output = await new Deno.Command(Deno.execPath(), {
      cwd: temporary,
      args: ["check", consumer],
      stdout: "piped",
      stderr: "piped",
    }).output();
    let error = new TextDecoder().decode(output.stderr);
    expect(output.success, error).toBe(true);
  } finally {
    await Deno.remove(temporary, { recursive: true });
  }
});
