import { defineMDSveXConfig as defineConfig, escapeSvelte } from 'mdsvex';
import { codeToHtml } from 'shiki';

const config = defineConfig({
	extensions: ['.md'],
	layout: 'src/lib/mdsvex_layout.svelte',

	smartypants: {
		dashes: 'oldschool',
	},

	highlight: {
		highlighter: async (code, lang = 'text') => {
			return escapeSvelte(
				await codeToHtml(code, {
					lang,
					themes: {
						light: 'github-light',
						dark: 'github-dark',
					},
				}),
			);
		},
	},
});

export default config;
