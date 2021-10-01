// NOTE: Use this file as a fallback for utils those don't support `exports` field in package.json
/** @type {import('./src/testing-library')} */
module.exports = require("./dist/cjs/testing-library");
