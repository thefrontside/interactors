/* Add indexes of all dynamically loaded assets so that they can be staticalized */

import { x } from "tinyexec";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { Parser, Builder } from "xml2js";

const [parser, builder] = [new Parser(), new Builder()];

const sitemapXML = readFileSync("./build/interactors/sitemap.xml");

const sitemap = await parser.parseStringPromise(sitemapXML);

// ideally we would use the docusaurs sitemap plugin to do this
// but support for plugins came with => 3.0.0 and upgrade no thank you.
sitemap.urlset.url.push({
  loc: 'https://interactors.deno.dev/interactors/assets/js/index.html',
}, {
  loc: 'https://interactors.deno.dev/interactors/images/index.html'
});


// add all of the typedoc files to the sitemap.
const docfiles = x('find', ['build/interactors/html','build/interactors/mui', '-name', '*.html']);
for await (const filename of docfiles) {
  const path = filename.replace(/^build/,'');
  sitemap.urlset.url.push({
    loc: `https://interactors.deno.dev${path}`,
  })
}

writeFileSync("./build/interactors/sitemap.xml", builder.buildObject(sitemap));

const assets = readdirSync("./build/interactors/assets/js");

writeFileSync("./build/interactors/assets/js/index.html",`
<html>
  <head>
${assets.map((asset) => `    <link rel="asset" href="${asset}"/>`).join("\n")}
  </head>
  <body>
  <h1> JavaScript Index</h1>
  <ul>

${assets.map((asset) => `    <li><a href="${asset}">${asset}</a></li>`).join("\n")}

  </ul>
  <body>
<html>

`);

const images = readdirSync("./build/interactors/images");

writeFileSync("./build/interactors/images/index.html",`
<html>
  <head>
${images.map((image) => `    <link rel="asset" href="${image}"/>`).join("\n")}
  </head>
  <body>
  <h1> JavaScript Index</h1>
  <ul>

${images.map((image) => `    <li><a href="${image}">${image}</a></li>`).join("\n")}

  </ul>
  <body>
<html>

`);
