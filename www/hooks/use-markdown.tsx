import { call, type Operation } from "effection";
import rehypeAddClasses from "rehype-add-classes";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { JSXElement } from "revolution/jsx-runtime";
import { useMDX, UseMDXOptions } from "./use-mdx.tsx";

export type UseMarkdownOptions = UseMDXOptions;

export function* useMarkdown(
  markdown: string,
  options?: UseMarkdownOptions,
): Operation<JSXElement> {
  // Escape generic type parameters like <T> that MDX interprets as JSX tags
  let sanitized = markdown.replace(
    /<([A-Z]\w*(?:\s*,\s*[A-Z]\w*)*)>/g,
    "&lt;$1&gt;",
  );

  let mod = yield* useMDX(sanitized, {
    remarkPlugins: [remarkGfm, ...(options?.remarkPlugins ?? [])],
    rehypePlugins: [
      [
        rehypePrismPlus,
        {
          showLineNumbers: true,
        },
      ],
      [rehypeSlug],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className:
              "opacity-0 group-hover:opacity-100 after:content-['#'] after:ml-1.5 no-underline",
          },
        },
      ],
      [
        rehypeAddClasses,
        {
          "h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]":
            "group scroll-mt-[100px] grow",
          pre: "grid",
        },
      ],
      ...(options?.rehypePlugins ?? []),
    ],
    remarkRehypeOptions: options?.remarkRehypeOptions,
  });

  return yield* call(async () => {
    try {
      return await mod.default();
    } catch (e) {
      console.error(`Failed to render markdown`, e);
      return <></>;
    }
  });
}
