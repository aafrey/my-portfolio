// import adapter from '@sveltejs/adapter-auto';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	kit: {
// 		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
// 		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
// 		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
// 		adapter: adapter({pages:"build"})
// 	}
// };

// export default config;
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ fallback: '404.html' }),  // Handle 404 fallback page for static deployment
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH || '',  // Ensure it's an empty string for local dev
		},
	},
};

export default config;
