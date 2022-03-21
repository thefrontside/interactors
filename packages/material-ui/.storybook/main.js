module.exports = {
  stories: ["../stories/**/*.stories.@(md|ts)x"],
  addons: ["@storybook/addon-postcss", "@storybook/addon-essentials", '@storybook/addon-interactions'],
  features: { previewCsfV3: true, interactionsDebugger: true },
  core: { builder: "webpack5" },
  typescript: { reactDocgen: false },
};
