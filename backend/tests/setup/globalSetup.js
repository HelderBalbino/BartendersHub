// Jest global setup: centralize environment flags and silence expected warnings
export default async () => {
	process.env.NODE_ENV = 'test';
	if (!process.env.DISABLE_REDIS) process.env.DISABLE_REDIS = 'true';
	if (!process.env.USE_IN_MEMORY_DB) process.env.USE_IN_MEMORY_DB = 'true';

	const originalWarn = console.warn;
	const expectedPatterns = [
		/Email transporter not configured/i,
		/Email disabled/i,
		/WebSocket not initialized/i,
		/Redis connection error/i,
	];
	global.__ORIGINAL_WARN__ = originalWarn;
	console.warn = (...args) => {
		const msg = args.map(String).join(' ');
		if (expectedPatterns.some((r) => r.test(msg))) return; // swallow noise
		originalWarn(...args);
	};
};
