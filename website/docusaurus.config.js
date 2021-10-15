module.exports = {
  title: "Interactors",
  tagline: "Page Objects for components libraries",
  url: "https://frontside.com/",
  baseUrl: "/interactors/",
  onBrokenLinks: "throw",
  favicon: "images/favicon-interactors.png",
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
      logo: {
        alt: 'Interactors',
        src: 'images/interactors-logo.svg',
      },
      items: [
        {
          to: "/docs",
          label: "Docs",
          position: "right",
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
          title: 'About',
          items: [
            {
              label: "Maintained by Frontside",
              href: "https://fronside.com/",
            },
            {
              label: "Interactors Release Post",
              href: "https://frontside.com/blog/2021-08-04-interactors-design-systems/"
            }
          ]
        },
        {
          title: "OSS Projects",
          items: [
            {
              label: "Interactors",
              to: "/",
            },
            {
              label: "Bigtest",
              href: "https://frontside.com/bigtest",
            },
            {
              label: "Effection",
              href: "https://frontside.com/effection",
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
    image: "images/meta-interactors.png",
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
  stylesheets: ["https://use.typekit.net/ugs0ewy.css"],
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
      "data-domain": "frontside.com",
    },
  ],
};
