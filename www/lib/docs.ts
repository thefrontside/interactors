import { basename } from "@std/path";
import {
  all,
  createContext,
  type Operation,
  resource,
  type Task,
  until,
  useScope,
} from "effection";
import { JSXElement } from "revolution/jsx-runtime";
import { useMarkdown } from "../hooks/use-markdown.tsx";

export interface Docs {
  all(): Operation<DocsPage[]>;
  get(id?: string): Operation<DocsPage | undefined>;
  first(): Operation<DocsPage>;
}

export interface Topic {
  name: string;
  items: DocsMeta[];
}

export interface DocsMeta {
  id: string;
  title: string;
  filename: string;
  topics: Topic[];
  next?: DocsMeta;
  prev?: DocsMeta;
}

export interface DocsPage extends DocsMeta {
  content: JSXElement;
  markdown: string;
}

type StructureJson = Record<string, [string, string][]>;

const DocsContext = createContext<Docs>("docs");

export function* initDocs(): Operation<void> {
  let docs = yield* loadDocs();
  yield* DocsContext.set(docs);
}

export function* useDocs(): Operation<Docs> {
  return yield* DocsContext.expect();
}

function loadDocs(): Operation<Docs> {
  return resource(function* (provide) {
    let scope = yield* useScope();
    let loaders = new Map<string, Task<DocsPage>>();

    let structureModule = yield* until(
      import("../docs/structure.json", { with: { type: "json" } }),
    );

    let structure: StructureJson = structureModule.default;
    let entries = Object.entries(structure);
    let topics: Topic[] = [];

    for (let [name, contents] of entries) {
      let topic: Topic = { name, items: [] };
      topics.push(topic);

      let current: DocsMeta | undefined = void 0;
      for (let i = 0; i < contents.length; i++) {
        let prev: DocsMeta | undefined = current;
        let [filename, title] = contents[i];
        let meta: DocsMeta = current = {
          id: basename(filename, ".md"),
          title,
          filename: `docs/${filename}`,
          topics,
          prev,
        };
        if (prev) {
          prev.next = current;
        }
        topic.items.push(current);

        loaders.set(
          meta.id,
          scope.run(function* () {
            let dir = new URL(".", import.meta.url).pathname;
            let path = `${dir}../${meta.filename}`;
            let source = yield* until(Deno.readTextFile(path));

            // Strip frontmatter
            let stripped = source.replace(/^---[\s\S]*?---\n*/, "");

            let content = yield* useMarkdown(stripped);

            return {
              ...meta,
              markdown: source,
              content,
            };
          }),
        );
      }
    }

    yield* provide({
      *first() {
        let [[, task]] = loaders.entries();
        return yield* task;
      },
      *all() {
        return yield* all([...loaders.values()]);
      },
      *get(id) {
        if (id) {
          let task = loaders.get(id);
          if (task) {
            return yield* task;
          }
        }
      },
    });
  });
}
