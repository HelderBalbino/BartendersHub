# Backend Performance Optimization Recommendations

## 1. Database Optimization

### Add Database Indexes

```javascript
// In User model
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

// In Cocktail model
cocktailSchema.index({ author: 1 });
cocktailSchema.index({ difficulty: 1 });
cocktailSchema.index({ 'ingredients.name': 1 });
cocktailSchema.index({ tags: 1 });
cocktailSchema.index({ createdAt: -1 });
cocktailSchema.index({ rating: -1 });

// Compound indexes for common queries
cocktailSchema.index({ author: 1, createdAt: -1 });
cocktailSchema.index({ difficulty: 1, rating: -1 });
```

### Implement Pagination

```javascript
// In cocktail controller
export const getCocktails = async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 12;
	const skip = (page - 1) * limit;

	const cocktails = await Cocktail.find(filter)
		.populate('author', 'name username avatar')
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.lean(); // Use lean() for better performance

	const total = await Cocktail.countDocuments(filter);

	res.json({
		cocktails,
		pagination: {
			current: page,
			total: Math.ceil(total / limit),
			hasNext: page * limit < total,
			hasPrev: page > 1,
		},
	});
};
```

## 2. Caching Strategy

### Redis Caching

```javascript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache middleware
export const cacheMiddleware = (duration = 300) => {
	return async (req, res, next) => {
		const key = `cache:${req.originalUrl}`;

		try {
			const cached = await redis.get(key);
			if (cached) {
				return res.json(JSON.parse(cached));
			}
		} catch (error) {
			console.error('Cache error:', error);
		}

		res.sendResponse = res.json;
		res.json = (body) => {
			redis.setex(key, duration, JSON.stringify(body));
			res.sendResponse(body);
		};

		next();
	};
};
```

## 3. Image Optimization

### Cloudinary Optimization

```javascript
const optimizeImageUrl = (publicId, options = {}) => {
	const {
		width = 400,
		height = 300,
		quality = 'auto',
		format = 'auto',
	} = options;

	return cloudinary.url(publicId, {
		width,
		height,
		crop: 'fill',
		quality,
		format,
		fetch_format: 'auto',
	});
};
```

## 4. API Response Optimization

### Use Field Selection

```javascript
// Allow clients to select specific fields
export const getCocktails = async (req, res) => {
	const fields = req.query.fields
		? req.query.fields.split(',').join(' ')
		: '';

	const cocktails = await Cocktail.find(filter)
		.select(fields)
		.populate('author', 'name username')
		.lean();

	res.json(cocktails);
};
```

## 5. Background Jobs

### Email Queue Implementation

```javascript
import Bull from 'bull';

const emailQueue = new Bull('email queue', process.env.REDIS_URL);

emailQueue.process(async (job) => {
	const { to, subject, template, data } = job.data;
	// Send email logic
});

// Usage
export const sendWelcomeEmail = (userData) => {
	emailQueue.add('welcome', {
		to: userData.email,
		subject: 'Welcome to BartendersHub',
		template: 'welcome',
		data: userData,
	});
};
```
