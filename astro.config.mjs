// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import starlightImageZoom from 'starlight-image-zoom';
import relativeMarkdownLinks from 'astro-rehype-relative-markdown-links';
import { unified } from '@astrojs/markdown-remark';

// Served by GitHub Pages from the open-mmorpg/documentation repository.
const site = 'https://open-mmorpg.github.io';
const base = '/documentation';

export default defineConfig({
	site,
	base,
	markdown: {
		// Pages link to each other as relative `.md` files so the links also work when the
		// Markdown is read on github.com; this rewrites them to site URLs at build time.
		processor: unified({
			rehypePlugins: [[relativeMarkdownLinks, { base, collectionBase: false, trailingSlash: 'always' }]],
		}),
	},
	integrations: [
		starlight({
			title: 'Open MMORPG',
			description: 'Documentation for Open MMORPG, a free, community-maintained Unity MMO framework.',
			logo: { src: './src/assets/logo.png' },
			favicon: '/favicon.png',
			social: [
				{ icon: 'github', label: 'Open MMORPG on GitHub', href: 'https://github.com/open-mmorpg/OpenMMORPG' },
				{ icon: 'discord', label: 'Open MMORPG on Discord', href: 'https://discord.gg/Czgrg4YGgq' },
			],
			editLink: { baseUrl: 'https://github.com/open-mmorpg/documentation/edit/main/' },
			lastUpdated: true,
			customCss: ['./src/styles/custom.css'],
			// Screenshots are often wider than the page; a click opens them full size.
			plugins: [starlightLinksValidator(), starlightImageZoom()],
			sidebar: [
				{ label: 'Guide', items: [{ autogenerate: { directory: 'guide' } }] },
				{ label: 'Characters & Entities', items: [{ autogenerate: { directory: 'characters' } }] },
				{ label: 'Combat & Skills', items: [{ autogenerate: { directory: 'combat' } }] },
				{ label: 'Items & Equipment', items: [{ autogenerate: { directory: 'items' } }] },
				{ label: 'World & Environment', items: [{ autogenerate: { directory: 'world' } }] },
				{ label: 'NPCs & Quests', items: [{ autogenerate: { directory: 'quests' } }] },
				{ label: 'Gameplay Systems', items: [{ autogenerate: { directory: 'gameplay' } }] },
				{ label: 'MMO Architecture', items: [{ autogenerate: { directory: 'mmo' } }] },
				{ label: 'Advanced & Customization', items: [{ autogenerate: { directory: 'advanced' } }] },
				{ label: 'Troubleshooting & FAQ', items: [{ autogenerate: { directory: 'troubleshooting' } }] },
			],
		}),
	],
});
