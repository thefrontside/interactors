const { VanillaExtractPlugin } = require("@vanilla-extract/webpack-plugin");

module.exports = {
  plugins: [new VanillaExtractPlugin()],
};
const isProd = process.env.NODE_ENV === "production";

module.exports = function (_, { id, ...options }) {
  console.dir("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
  return {
    name: "docusaurus-plugin-vanilla-extract",
    configureWebpack(_, isServer, utils) {
      return {
        plugins: [new VanillaExtractPlugin()],
      };
    },
  };
};
