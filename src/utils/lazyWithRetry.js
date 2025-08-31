// Utility to wrap React.lazy dynamic imports with retry logic.
// Handles transient network/CDN failures (e.g. ChunkLoadError / failed to fetch dynamic module)
// and performs exponential backoff retries before optionally forcing a one-time full reload.
// Prevents an infinite reload loop by marking a sessionStorage flag.
import { lazy } from 'react';

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY = 600; // ms

export default function lazyWithRetry(
	factory,
	{
		retries = DEFAULT_MAX_RETRIES,
		baseDelay = DEFAULT_BASE_DELAY,
		reloadOnFail = true,
	} = {},
) {
	return lazy(
		() =>
			new Promise((resolve, reject) => {
				let attempt = 0;

				const load = () => {
					factory()
						.then((mod) => {
							// Clear reload flag on success
							sessionStorage.removeItem('__chunk_reload__');
							resolve(mod);
						})
						.catch((err) => {
							const message = err?.message || '';
							const isChunkError =
								/ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module/i.test(
									message,
								);

							if (isChunkError && attempt < retries) {
								attempt += 1;
								const delay = baseDelay * attempt; // simple linear backoff
								setTimeout(load, delay);
								return;
							}

							if (isChunkError && reloadOnFail) {
								// Only force a single reload per session to pull a fresh index.html + manifest
								if (
									!sessionStorage.getItem('__chunk_reload__')
								) {
									sessionStorage.setItem(
										'__chunk_reload__',
										'1',
									);
									// Full reload to fetch updated assets (stale HTML referencing purged chunks)
									window.location.reload();
									return; // Let the navigation occur; promise can remain pending.
								}
							}
							reject(err);
						});
				};

				load();
			}),
	);
}
