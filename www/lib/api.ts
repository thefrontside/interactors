import { createContext, type Operation, resource, type Task, all, until, useScope } from "effection";
import { doc, type DocNode } from "@deno/doc";
import { JSXElement } from "revolution/jsx-runtime";
import { useMarkdown } from "../hooks/use-markdown.tsx";

export interface ApiPackage {
  name: string;
  slug: string;
  symbols(): Operation<ApiSymbol[]>;
  symbol(name: string): Operation<ApiSymbol | undefined>;
}

export interface ApiSymbol {
  name: string;
  kind: string;
  description: string;
  content: JSXElement;
  declarations: DocNode[];
}

interface PackageSpec {
  name: string;
  slug: string;
  entrypoint: string;
}

const ApiContext = createContext<ApiPackage[]>("api");

const packages: PackageSpec[] = [
  {
    name: "@interactors/html",
    slug: "html",
    entrypoint: new URL("../../packages/html/mod.ts", import.meta.url).href,
  },
  {
    name: "@interactors/material-ui",
    slug: "material-ui",
    entrypoint: new URL("../../packages/material-ui/mod.ts", import.meta.url).href,
  },
];

export function* initApi(): Operation<void> {
  let pkgs: ApiPackage[] = [];

  for (let spec of packages) {
    pkgs.push(yield* loadApiPackage(spec));
  }

  yield* ApiContext.set(pkgs);
}

export function* useApi(): Operation<ApiPackage[]> {
  return yield* ApiContext.expect();
}

export function* useApiPackage(slug: string): Operation<ApiPackage | undefined> {
  let pkgs = yield* useApi();
  return pkgs.find((p) => p.slug === slug);
}

function loadApiPackage(spec: PackageSpec): Operation<ApiPackage> {
  return resource(function* (provide) {
    let scope = yield* useScope();
    let symbolsTask: Task<ApiSymbol[]> | undefined;

    let pkg: ApiPackage = {
      name: spec.name,
      slug: spec.slug,
      *symbols() {
        if (!symbolsTask) {
          symbolsTask = scope.run(function* () {
            return yield* parsePackage(spec);
          });
        }
        return yield* symbolsTask;
      },
      *symbol(name) {
        let syms = yield* pkg.symbols();
        return syms.find((s) => s.name === name);
      },
    };

    yield* provide(pkg);
  });
}

function* parsePackage(spec: PackageSpec): Operation<ApiSymbol[]> {
  // doc() returns Record<string, DocNode[]> keyed by specifier URL
  let result = yield* until(doc([spec.entrypoint])) as unknown as Record<string, DocNode[]>;

  let nodes: DocNode[] = [];
  for (let items of Object.values(result)) {
    if (Array.isArray(items)) {
      nodes.push(...items);
    }
  }

  // Group by name, keep only exports
  let byName = new Map<string, DocNode[]>();
  for (let node of nodes) {
    if (node.declarationKind !== "export") continue;
    let existing = byName.get(node.name) ?? [];
    existing.push(node);
    byName.set(node.name, existing);
  }

  let symbols: ApiSymbol[] = [];

  for (let [name, decls] of byName) {
    let jsDocParts: string[] = [];
    let kind = decls[0]?.kind ?? "variable";

    for (let decl of decls) {
      if (decl.jsDoc?.doc) {
        jsDocParts.push(decl.jsDoc.doc);
      }
    }

    let markdown = jsDocParts.join("\n\n") || `\`${kind}\` ${name}`;

    // Strip {@link Foo} patterns that MDX can't handle
    markdown = markdown.replace(/\{@link\s+(\w+)\}/g, "`$1`");

    let content = yield* useMarkdown(markdown);

    symbols.push({
      name,
      kind,
      description: jsDocParts[0]?.split("\n")[0] ?? "",
      content,
      declarations: decls,
    });
  }

  // Sort alphabetically
  symbols.sort((a, b) => a.name.localeCompare(b.name));

  return symbols;
}
