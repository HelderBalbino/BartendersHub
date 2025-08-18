import Redis from 'ioredis';
import process from 'process';

// Allow disabling Redis during tests or via explicit flag to avoid noisy logs
const redisDisabled =
	process.env.NODE_ENV === 'test' || process.env.DISABLE_REDIS === 'true';

// Initialize Redis client only when not disabled
let redis = null;
if (!redisDisabled) {
	try {
		redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
			retryDelayOnFailover: 100,
			maxRetriesPerRequest: 3,
			lazyConnect: true, // don't auto-connect until a command is issued
		});

		redis.on('error', (err) => {
			// Use debug-style prefix to make filtering easier; suppress if tests ended
			if (process.env.NODE_ENV !== 'test') {
				console.warn('Redis connection error:', err.message);
			}
			redis = null; // Disable caching if Redis is unavailable
		});

		redis.on('connect', () => {
			console.log('✅ Redis cache connected');
		});
	} catch (error) {
		if (process.env.NODE_ENV !== 'test') {
			console.warn('Redis initialization failed:', error.message);
		}
		redis = null;
	}
}

// Cache middleware
export const cacheMiddleware = (duration = 300) => {
	// No-op middleware when redis disabled
	if (redisDisabled) {
		return (req, res, next) => next();
	}
	return async (req, res, next) => {
		// Skip caching if Redis is not available
		if (!redis) {
			return next();
		}

		// Skip caching for authenticated requests
		if (req.headers.authorization) {
			return next();
		}

		const key = `cache:${req.originalUrl}`;

		try {
			const cached = await redis.get(key);
			if (cached) {
				console.log(`🎯 Cache hit: ${key}`);
				return res.json(JSON.parse(cached));
			}
		} catch (error) {
			console.warn('Cache read error:', error.message);
		}

		// Store original res.json
		res.sendResponse = res.json;

		// Override res.json to cache the response
		res.json = (body) => {
			if (redis && res.statusCode === 200) {
				try {
					redis.setex(key, duration, JSON.stringify(body));
					console.log(`💾 Cached: ${key} for ${duration}s`);
				} catch (error) {
					console.warn('Cache write error:', error.message);
				}
			}
			res.sendResponse(body);
		};

		next();
	};
};

// Cache invalidation helpers
export const invalidateCache = (pattern = '*') => {
	if (redisDisabled || !redis) return Promise.resolve();
	return new Promise((resolve) => {
		const stream = redis.scanStream({ match: `cache:${pattern}` });
		stream.on('data', (keys) => {
			if (keys.length) {
				redis.del(...keys);
				console.log(`🗑️ Invalidated cache keys: ${keys.length}`);
			}
		});
		stream.on('end', resolve);
	});
};

// Specific cache invalidation functions
export const invalidateCocktailCache = () => {
	return invalidateCache('/api/cocktails*');
};

export const invalidateUserCache = () => {
	return invalidateCache('/api/users*');
};

export default redis;

// Graceful shutdown helper (used in global test teardown or process shutdown)
export const closeRedis = async () => {
	if (redis) {
		try {
			await redis.quit();
			console.log('🛑 Redis connection closed');
		} catch (err) {
			console.warn('Redis close error:', err.message);
		}
	}
};
