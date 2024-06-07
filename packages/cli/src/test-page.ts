import {
  call,
  createSignal,
  each,
  Operation,
  resource,
  spawn,
} from "effection";
import { readFile } from "fs/promises";
import { chromium, Page } from "playwright";
import { buildAttrs, BuildOptions } from "./build";

interface TestPage {
  update(): Operation<void>;
}

export function useTestPage(
  url: string,
  options: BuildOptions,
): Operation<TestPage> {
  return resource(function* (provide) {
    let { agentScriptPath, constructorsPath } = buildAttrs(options);

    let { browser, page } = yield* call(async () => {
      let browser = await chromium.launch({ headless: false });
      let context = await browser.newContext();
      let page = await context.newPage();
      await page.goto(url);
      return { browser, page };
    });

    let repl = yield* useRepl(constructorsPath, page);

    try {
      yield* provide({
        *update() {
          let decoder = new TextDecoder();
          let source = decoder.decode(
            yield* call(() => readFile(agentScriptPath)),
          );
          yield* call(async () => {
            await page.addInitScript(source);
            await page.evaluate(source);
          });
          yield* repl.reset();
        },
      });
    } finally {
      yield* call(() => browser.close());
    }
  });
}

import vm from "node:vm";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { createInterface } from "node:readline";
import { TInteraction } from "@interactors/core/dist/specification";

interface REPL {
  reset(): Operation<void>;
}

export function useRepl(constructorsPath: string, page: Page): Operation<REPL> {
  return resource(function* (provide) {
    let history = yield* useHistoryFile(
      path.join(os.homedir(), ".interactors.history"),
    );
    let context = vm.createContext({});

    let rl = createInterface({
      prompt: "> ",
      input: process.stdin,
      output: process.stdout,
      history: history.current,
      crlfDelay: 0,
    });

    let lines = createSignal<string>();

    yield* spawn(function* () {
      for (let line of yield* each(lines)) {
        if (line.trim() !== "") {
          try {
            let interaction = vm.runInContext(line, context) as TInteraction;
            let value = JSON.parse(JSON.stringify(interaction));
            yield* call(async () => {
              let result = await page.evaluate(
                //@ts-expect-error nobody knows about 'interactorAgent' but us
                (interaction) => window.interactorAgent.run(interaction),
                value,
              );
              console.log(result);
            });
          } catch (error) {
            console.error((error as Error)?.message);
          }
          rl.prompt();
        }
        yield* each.next();
      }
    });

    try {
      rl.on("history", history.update);
      rl.on("line", lines.send);
      yield* provide({
        *reset() {
          yield* call(async () => {
            console.log("(re)enter interactive mode");
            rl.prompt();
            try {
              let constructors = await import(path.resolve(constructorsPath));
              context = vm.createContext(constructors);
            } catch (error) {
              console.error((error as Error)?.message);
            }
          });
        },
      });
    } finally {
      rl.off("history", history.update);
      rl.off("lines", lines.send);
      rl.close();
    }
  });
}

interface HistoryFile {
  current: string[];
  update(value: string[]): void;
}

function useHistoryFile(filepath: string): Operation<HistoryFile> {
  return resource(function* (provide) {
    const signal = createSignal<string[]>();

    const fd = yield* call(() => fs.open(filepath, "a+"));

    const contents = yield* call(() => fd.readFile());
    const handle: HistoryFile = {
      current: contents.toString().split("\n"),
      update: signal.send,
    };
    yield* spawn(function* () {
      for (const value of yield* each(signal)) {
        handle.current = value;
        yield* call(() => fd.truncate());
        yield* call(() => fd.write(new TextEncoder().encode(value.join("\n"))));
        yield* each.next();
      }
    });

    try {
      yield* provide(handle);
    } finally {
      yield* call(() => fd.close());
    }
  });
}
