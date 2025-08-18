import process from 'process';

// Centralized application configuration
// Parses and normalizes environment variables so other modules don't touch process.env directly

const toNumber = (val, fallback) => {
	const n = parseInt(val, 10);
	return Number.isNaN(n) ? fallback : n;
};

// CORS origins: comma-separated list via CORS_ORIGINS plus FRONTEND_URL fallback and sensible localhost defaults
const explicitOrigins = (process.env.CORS_ORIGINS || '')
	.split(',')
	.map((o) => o.trim())
	.filter(Boolean);

const defaultLocalOrigins = ['http://localhost:5173', 'http://localhost:3000'];

const frontendUrl = process.env.FRONTEND_URL?.trim();

// Build unique list preserving order of declaration precedence
const allowedOrigins = Array.from(
	new Set(
		[
			...(explicitOrigins.length ? explicitOrigins : []),
			frontendUrl,
			...defaultLocalOrigins,
		].filter(Boolean),
	),
);

const config = {
	env: process.env.NODE_ENV || 'development',
	port: toNumber(process.env.PORT, 5001),
	uploads: {
		maxFileSize: toNumber(process.env.MAX_FILE_SIZE, 5_000_000), // 5MB default
	},
	cors: {
		allowedOrigins,
	},
};

export default config;
