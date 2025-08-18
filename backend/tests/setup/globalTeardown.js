import { closeRedis } from '../../src/middleware/cache.js';

export default async () => {
	if (global.__ORIGINAL_WARN__) {
		console.warn = global.__ORIGINAL_WARN__;
	}
	try {
		await closeRedis();
	} catch {
		// ignore
	}
};
