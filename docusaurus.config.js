/**
 * Copyright (c) Flashbots Ltd. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
require('dotenv').config();
const { themes } = require('prism-react-renderer');

const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @returns {Promise<import('@docusaurus/types').Config>} */
module.exports = async function createConfigAsync() {
  return {
    title: 'BuilderNet',
    tagline: 'Illuminate Dmocrtz Dstrib Prtct',
    baseUrl: process.env.BASE_URL || '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'BuilderNet',
    projectName: 'docs',
    url: process.env.TARGET_URL,
    markdown: {
      mermaid: true,
    },
    themes: ['@docusaurus/theme-mermaid'],
    stylesheets: [
      {
        href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
        type: 'text/css',
        integrity:
          'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
        crossorigin: 'anonymous',
      },
    ],
    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        algolia: {
          apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
          indexName: process.env.ALGOLIA_INDEX_NAME,
          appId: process.env.ALGOLIA_APP_ID,
          contextualSearch: false,
        },
        colorMode: {
          defaultMode: 'light',
        },
        prism: {
          theme: lightTheme,
          darkTheme,
          additionalLanguages: ['solidity', 'typescript', 'bash', 'json', 'javascript', 'yaml', 'toml', 'go'], // https://docusaurus.io/docs/markdown-features/code-blocks#supported-languages
        },
        docs: {
          sidebar: {
            hideable: true,
          },
        },
        navbar: {
          title: 'BuilderNet',
          logo: {
            alt: 'Flashbots Logo',
            src: 'img/logo.png',
          },
          items: [
            { to: '/docs', label: 'Docs', position: 'left' }, // or position: 'right'
            { to: '/blog', label: 'Blog', position: 'left' }, // or position: 'right'
            {
              href: 'https://collective.flashbots.net/c/buildernet/31',
              label: 'Forum',
              position: 'right',
            },
            {
              href: 'http://t.me/buildernet_general',
              label: 'Telegram',
              position: 'right',
            },
          ],
        },
        image: 'img/buildernet-cover-photo-m.jpg',
      }),
    presets: [
      [
        '@docusaurus/preset-classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        {
          docs: {
            sidebarPath: require.resolve('./docs/sidebars.js'),
            routeBasePath: 'docs',
            id: 'docs',
            editUrl: 'https://github.com/BuilderNet/website/edit/main/',
            showLastUpdateTime: false,
            remarkPlugins: [(await import('remark-math')).default],
            rehypePlugins: [(await import('rehype-katex')).default],
          },
          theme: {
            customCss: require.resolve('./src/css/custom.css'),
          },
          blog: {
            path: 'blog',
            // editUrl: 'https://github.com/BuilderNet/website/edit/main/',
            editLocalizedFiles: false,
            blogTitle: 'BuilderNet Blog',
            blogDescription: 'Blog',
            blogSidebarCount: 0,
            blogSidebarTitle: 'All our posts',
            routeBasePath: 'blog',
            include: ['**/*.{md,mdx}'],
            exclude: [
              '**/_*.{js,jsx,ts,tsx,md,mdx}',
              '**/_*/**',
              '**/*.test.{js,jsx,ts,tsx}',
              '**/__tests__/**',
            ],
            postsPerPage: 'ALL',
            blogListComponent: '@theme/BlogListPage',
            blogPostComponent: '@theme/BlogPostPage',
            blogTagsListComponent: '@theme/BlogTagsListPage',
            blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
            remarkPlugins: [(await import('remark-math')).default],
            rehypePlugins: [],
            beforeDefaultRemarkPlugins: [],
            beforeDefaultRehypePlugins: [],
            truncateMarker: /<!--\s*(truncate)\s*-->/,
            showReadingTime: true,
          },
          sitemap: {
            lastmod: 'date',
            changefreq: 'weekly',
            priority: 0.5,
            ignorePatterns: ['/tags/**'],
            filename: 'sitemap.xml',
            createSitemapItems: async (params) => {
              const { defaultCreateSitemapItems, ...rest } = params;
              const items = await defaultCreateSitemapItems(rest);
              return items.filter((item) => !item.url.includes('/page/'));
            },
          },
        },
      ],
    ],
    plugins: [
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      '@docusaurus/plugin-ideal-image',
    ],
  };
};
