module.exports = {
  stories: ["../stories/**/*.stories.@(md|ts)x"],
  addons: ["@storybook/addon-postcss", "@storybook/addon-essentials"],
  features: { previewCsfV3: true },
  core: { builder: "webpack5" },
};
