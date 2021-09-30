module.exports = {
  title: "Interactors",
  tagline: "Test your app as real people use it",
  url: "https://frontside.com",
  baseUrl: "/interactors/",
  onBrokenLinks: "throw",
  favicon: "images/favicon.png",
  organizationName: "thefrontside",
  projectName: "interactors",
  themeConfig: {
    colorMode: {
      disableSwitch: true,
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: require("prism-react-renderer/themes/nightOwl"),
    },
    navbar: {
      title: "Interactors",
      items: [
        {
          to: "/docs",
          label: "Docs",
          position: "left",
        },
        {
          href: "https://github.com/thefrontside/interactors",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://discord.gg/r6AvtnU",
          label: "Discord",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Interactors",
          items: [
            {
              label: "About Interactors",
              to: "/",
            },
            {
              label: "Docs",
              to: "docs",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/r6AvtnU",
            },
            {
              label: "GitHub",
              href: "https://github.com/thefrontside/interactors",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Frontside Software, Inc.`,
    },
    image: "images/meta-image.png",
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          versions: {
            current: {
              banner: "none",
            },
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  stylesheets: ["https://use.typekit.net/gyc5wys.css"],
  plugins: [
    [
      require.resolve("./plugins/docusaurus-plugin-vanilla-extract"),
      {
        /* options */
      },
    ],
  ],
  scripts: [
    {
      src: "https://plausible.io/js/plausible.js",
      async: true,
      defer: true,
      "data-domain": "frontside.com/interactors",
    },
  ],
};
