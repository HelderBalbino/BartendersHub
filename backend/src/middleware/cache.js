import Redis from 'ioredis';
import process from 'process';

// Initialize Redis client (will gracefully handle if Redis is not available)
let redis = null;

try {
	redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
		retryDelayOnFailover: 100,
		maxRetriesPerRequest: 3,
		lazyConnect: true,
	});

	redis.on('error', (err) => {
		console.warn('Redis connection error:', err.message);
		redis = null; // Disable caching if Redis is unavailable
	});

	redis.on('connect', () => {
		console.log('✅ Redis cache connected');
	});
} catch (error) {
	console.warn('Redis initialization failed:', error.message);
	redis = null;
}

// Cache middleware
export const cacheMiddleware = (duration = 300) => {
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
	if (!redis) return;

	return new Promise((resolve) => {
		const stream = redis.scanStream({
			match: `cache:${pattern}`,
		});

		stream.on('data', (keys) => {
			if (keys.length) {
				redis.del(...keys);
				console.log(`🗑️ Invalidated cache keys: ${keys.length}`);
			}
		});

		stream.on('end', () => {
			resolve();
		});
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
