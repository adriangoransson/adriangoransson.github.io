import { dev } from '$app/environment';

const pages = import.meta.glob('./*/+page.md');

export interface Post {
	title: string;
	date?: string;
	path: string;
	blurb: string;
}

export const load = async () => {
	const posts = await Promise.all(
		Object.entries(pages).map(async ([path, resolve]): Promise<Post> => {
			const component = await resolve();

			return {
				...component.metadata,
				path: path.split('+')[0],
			};
		}),
	);

	const processed = posts
		.filter((p) => dev || p.date) // Include dateless posts in dev mode (drafts).
		.sort((p1, p2) => {
			if (p1.date === p2.date) {
				return p1.title < p2.title ? -1 : 1;
			}

			if (!p1.date) {
				return -1;
			}

			if (!p2.date) {
				return 1;
			}

			return p1.date > p2.date ? -1 : 1;
		});

	return {
		posts: processed,
	};
};
