// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'TradeSim Docs',
  tagline: 'Documentation for the TradeSim Project',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://punosie.github.io',
  baseUrl: '/TradeSim/',
  organizationName: 'Punosie', 
  projectName: 'TradeSim',
  deploymentBranch: 'gh-pages',

  "trailingSlash": false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'TRADESIM',
        logo: {
          alt: 'TRADESIM Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/Punosie/TradeSim',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://www.linkedin.com/in/shubhankar-kaushik/',
            label: 'LinkedIn',
            position: 'right',
          },
        ],
      },
      footer: {
        copyright: `© 2025 Shubhankar Kaushik`,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
