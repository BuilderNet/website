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
    // Match vercel.json (trailingSlash: false) so canonical URLs and the sitemap use the same form.
    trailingSlash: false,
    favicon: 'img/favicon.ico',
    organizationName: 'BuilderNet',
    projectName: 'docs',
    url: process.env.TARGET_URL,
    markdown: {
      mermaid: true,
    },
    themes: ['@docusaurus/theme-mermaid'],
    headTags: [
      {
        tagName: 'script',
        attributes: { type: 'application/ld+json' },
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'BuilderNet',
          url: 'https://buildernet.org',
          logo: 'https://buildernet.org/img/logo.png',
          sameAs: [
            'https://collective.flashbots.net/c/buildernet/31',
            'https://t.me/buildernet_general',
            'https://github.com/BuilderNet',
            'https://github.com/flashbots/rbuilder',
          ],
        }),
      },
    ],
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
        footer: {
          style: 'dark',
          links: [
            {
              title: 'Send orderflow',
              items: [
                { label: 'Send bundles', to: '/docs/send-orderflow' },
                { label: 'Priority updates (propAMM)', to: '/docs/api#priority-updates' },
                { label: 'Wallets and apps', to: '/docs/how-to-participate' },
                { label: 'Refunds', to: '/docs/refunds' },
                { label: 'API reference', to: '/docs/api' },
              ],
            },
            {
              title: 'Network',
              items: [
                { label: 'What is BuilderNet', to: '/docs' },
                { label: 'Architecture', to: '/docs/architecture' },
                { label: 'Verifiable system integrity', to: '/docs/verifiable-system-integrity' },
                { label: 'Operate a node', to: '/docs/operating-a-node' },
                { label: 'Dune dashboard', href: 'https://dune.com/flashbots/buildernet' },
              ],
            },
            {
              title: 'Community',
              items: [
                { label: 'Blog', to: '/blog' },
                { label: 'Forum', href: 'https://collective.flashbots.net/c/buildernet/31' },
                { label: 'Telegram', href: 'https://t.me/buildernet_general' },
                { label: 'GitHub', href: 'https://github.com/BuilderNet' },
                { label: 'rbuilder', href: 'https://github.com/flashbots/rbuilder' },
                { label: 'Flashbots', href: 'https://www.flashbots.net' },
              ],
            },
          ],
          copyright: `Copyright © ${new Date().getFullYear()} Flashbots.`,
        },
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
            blogDescription: 'BuilderNet release notes and announcements.',
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
            ignorePatterns: ['/tags/**', '/search'],
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
      [
        // Generates /llms.txt (index) and /llms-full.txt (all docs + blog posts) at build time,
        // so LLM-based assistants can ingest the documentation directly. https://llmstxt.org
        'docusaurus-plugin-llms',
        {
          title: 'BuilderNet documentation',
          description:
            'BuilderNet is a TEE-based block building network for Ethereum. Refunds minimise execution costs; private transactions, bundles and propAMM quote updates go directly to the builder.',
          rootContent:
            'BuilderNet is a TEE-based block building network for Ethereum. It pays refunds to minimise execution costs, and gives end users, market makers, traders and searchers the tools for efficient execution: private transactions, bundles and propAMM quote updates (priority updates), sent directly to the builder. These docs cover how to send orderflow, how refunds work, and how to operate a node. Site: https://buildernet.org. Send orderflow: https://buildernet.org/docs/send-orderflow. API reference: https://buildernet.org/docs/api. Refunds: https://buildernet.org/docs/refunds.',
          includeBlog: true,
          ignoreFiles: ['_*', '**/_*'],
          excludeImports: true,
          removeDuplicateHeadings: true,
          generateMarkdownFiles: false,
        },
      ],
    ],
  };
};
