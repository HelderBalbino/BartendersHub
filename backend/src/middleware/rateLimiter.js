import rateLimit from 'express-rate-limit';
import process from 'process';

// General rate limiter
export const limiter = rateLimit({
	windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000, // 15 minutes default
	max: parseInt(process.env.RATE_LIMIT_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
	message: {
		success: false,
		message: 'Too many requests from this IP, please try again later.',
	},
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiter for auth routes
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // limit each IP to 5 requests per windowMs
	message: {
		success: false,
		message: 'Too many authentication attempts, please try again later.',
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// File upload rate limiter
export const uploadLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // limit each IP to 10 uploads per windowMs
	message: {
		success: false,
		message: 'Too many file uploads, please try again later.',
	},
	standardHeaders: true,
	legacyHeaders: false,
});
