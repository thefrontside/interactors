import { call, type Operation } from "effection";
// deno-lint-ignore no-import-prefix
import { evaluate } from "npm:@mdx-js/mdx@3.1.0";
// deno-lint-ignore no-import-prefix
import type { MDXModule } from "npm:@types/mdx@2.0.13";
import { Fragment, jsx, jsxs } from "revolution/jsx-runtime";
import { PluggableList } from "unified";
// deno-lint-ignore no-import-prefix
import type { Options as RemarkRehypeOptions } from "npm:remark-rehype@11.1.1";

export interface UseMDXOptions {
  remarkPlugins?: PluggableList | null | undefined;
  rehypePlugins?: PluggableList | null | undefined;
  remarkRehypeOptions?: Readonly<RemarkRehypeOptions> | null | undefined;
}

export function* useMDX(
  markdown: string,
  options?: UseMDXOptions,
): Operation<MDXModule> {
  return yield* call(async function () {
    try {
      return await evaluate(markdown, {
        jsx,
        jsxs,
        jsxDEV: jsx,
        Fragment,
        ...options,
      });
    } catch (e) {
      console.log(`Failed to convert markdown to MDX: ${markdown.slice(0, 100)}`);
      throw e;
    }
  });
}
