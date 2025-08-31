import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { randomUUID, createHash } from 'crypto';

// Load env early
dotenv.config();

import { validateEnvironmentVariables } from './config/validateEnv.js';
import config from './config/appConfig.js';
validateEnvironmentVariables();

import { limiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sanitizeInput } from './middleware/sanitization.js';
import { getCacheMetrics, default as redisClient } from './middleware/cache.js';
import mongoose from 'mongoose';
import {
	detectSuspiciousActivity,
	monitorRateLimit,
} from './utils/securityMonitoring.js';
import authRoutes from './routes/auth.js';
import cocktailRoutes from './routes/cocktails.js';
import userRoutes from './routes/users.js';
import { responseHelpers } from './middleware/response.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Standard response helpers (must come before controllers use res.success/res.fail)
app.use(responseHelpers);

// Lightweight request ID + timing middleware
app.use((req, res, next) => {
	const start = process.hrtime.bigint();
	req.id = randomUUID();
	res.setHeader('X-Request-ID', req.id);
	res.on('finish', () => {
		const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
		if (durationMs > 1000) {
			console.warn(
				`⏱️ Slow request ${req.method} ${req.originalUrl} id=${
					req.id
				} ${durationMs.toFixed(1)}ms status=${res.statusCode}`,
			);
		}
	});
	next();
});
// Security middleware (helmet) restored
app.use(
	helmet(() => {
		const isProd = process.env.NODE_ENV === 'production';
		const scriptSrc = ["'self'"];
		if (!isProd) scriptSrc.push("'unsafe-eval'");
		return {
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					styleSrc: [
						"'self'",
						"'unsafe-inline'",
						'https://fonts.googleapis.com',
					],
					fontSrc: ["'self'", 'https://fonts.gstatic.com'],
					imgSrc: [
						"'self'",
						'data:',
						'https://res.cloudinary.com',
						'https://images.unsplash.com',
					],
					scriptSrc,
					connectSrc: ["'self'", 'https://api.cloudinary.com'],
					frameSrc: ["'none'"],
					objectSrc: ["'none'"],
					mediaSrc: ["'self'"],
					manifestSrc: ["'self'"],
				},
			},
			crossOriginEmbedderPolicy: false,
			crossOriginResourcePolicy: { policy: 'cross-origin' },
			hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
			noSniff: true,
			frameguard: { action: 'deny' },
			xssFilter: true,
			referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
			hidePoweredBy: true,
			ieNoOpen: true,
			dnsPrefetchControl: { allow: false },
			permittedCrossDomainPolicies: false,
		};
	}),
);

// Additional security headers
app.use((req, res, next) => {
	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
	);
	res.removeHeader('X-Powered-By');
	res.removeHeader('Server');
	next();
});

console.log('🌐 Allowed CORS origins:', config.cors.allowedOrigins);

const isOriginAllowed = (origin) => {
	if (!origin) return true;
	if (config.cors.allowedOrigins.includes(origin)) return true;
	if (
		origin.match(
			/^https:\/\/bartendershub-[a-z0-9]+-helder-balbinos-projects\.vercel\.app$/,
		)
	)
		return true;
	if (origin.match(/^https:\/\/.*\.bartendershub\.com$/)) return true;
	return false;
};

app.use(
	cors({
		origin(origin, callback) {
			if (isOriginAllowed(origin)) callback(null, true);
			else {
				console.warn('🚫 CORS blocked origin:', origin);
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: [
			'Content-Type',
			'Authorization',
			'X-Requested-With',
			'X-Request-ID',
		],
	}),
);

app.use(monitorRateLimit);
app.use(limiter);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(detectSuspiciousActivity);
app.use(sanitizeInput);

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/cocktails', cocktailRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', async (req, res) => {
	const cacheMetrics = getCacheMetrics();
	let dbStatus = 'disconnected';
	try {
		dbStatus =
			mongoose.connection.readyState === 1 ? 'connected' : 'connecting';
	} catch {
		/* ignore */
	}
	let redisStatus = 'disabled';
	if (redisClient) {
		try {
			await redisClient.ping();
			redisStatus = 'connected';
		} catch {
			redisStatus = 'error';
		}
	}
	res.status(200).json({
		success: true,
		message: 'BartendersHub API is running!',
		timestamp: new Date().toISOString(),
		cache: cacheMetrics,
		database: dbStatus,
		redis: redisStatus,
	});
});

app.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to BartendersHub API! 🥃',
		version: '1.0.0',
	});
});

// ------------------------------------------------------------
// Unified delayed redirect pages (analytics-friendly) for SPA routes
// ------------------------------------------------------------
const REDIRECT_DELAY_SECONDS = 1.5; // short lived delay for tracking
const redirectEvents = []; // in-memory ring (lightweight analytics)

function recordRedirect(event) {
	redirectEvents.unshift(event);
	if (redirectEvents.length > 200) redirectEvents.length = 200;
}

function buildSignedRedirectPage(kind, token, targetUrl, req) {
	const secret = process.env.REDIRECT_SIGNING_SECRET || 'dev-secret';
	const signature = createHash('sha256')
		.update(`${kind}:${token}:${secret}`)
		.digest('hex');
	const delay = REDIRECT_DELAY_SECONDS;
	const safeTarget = targetUrl.replace(/"/g, '%22');
	return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" />
	<title>Redirecting...</title>
	<meta http-equiv="refresh" content="${delay};url=${safeTarget}" />
	<meta name="robots" content="noindex" />
	<meta name="referrer" content="no-referrer" />
	<style>html,body{background:#090909;color:#eee;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif;height:100%;display:flex;align-items:center;justify-content:center;margin:0;padding:0}main{max-width:560px;padding:2rem;border:1px solid #333;background:#111}h1{font-size:1.3rem;font-weight:600;letter-spacing:.05em;color:#fbbf24;margin-top:0}a{color:#fbbf24}code{background:#222;padding:2px 4px;border-radius:3px;font-size:.85em}</style>
	</head><body><main data-kind="${kind}" data-signature="${signature}" data-token-frag="${token.slice(
		0,
		6,
	)}..." data-delay="${delay}">
	<h1>${
		kind === 'verify-email' ? 'Email Verification' : 'Password Reset'
	} Redirect</h1>
	<p>Taking you to the ${
		kind === 'verify-email' ? 'verification' : 'password reset'
	} page on the main site.</p>
	<p>If you are not redirected automatically within ${delay} seconds, <a href="${safeTarget}">click here</a>.</p>
	<p style="opacity:.6;font-size:.75rem">Event ID: <code>${
		req.id
	}</code><br/>Signature: <code>${signature.slice(0, 16)}...</code></p>
	</main></body></html>`;
}

function spaRedirectRoute(kind) {
	return (req, res) => {
		const { token } = req.params;
		const query = req.url.includes('?')
			? req.url.substring(req.url.indexOf('?'))
			: '';
		const frontendBase = (
			process.env.FRONTEND_URL_PROD ||
			process.env.FRONTEND_URL ||
			''
		).replace(/\/$/, '');
		if (!frontendBase) {
			return res
				.status(500)
				.send(
					'<h1>Redirect Misconfigured</h1><p>FRONTEND_URL not set on server.</p>',
				);
		}
		const targetUrl = `${frontendBase}/${kind}/${token}${query}`;
		recordRedirect({
			ts: new Date().toISOString(),
			ip: req.ip,
			kind,
			tokenFragment: token.slice(0, 8),
			ua: req.get('user-agent'),
			target: targetUrl,
			requestId: req.id,
		});
		console.log(
			`🔄 Redirect (${kind}) token=${token.slice(0, 8)}… -> ${targetUrl}`,
		);
		res.status(200).send(
			buildSignedRedirectPage(kind, token, targetUrl, req),
		);
	};
}

app.get('/verify-email/:token', spaRedirectRoute('verify-email'));
app.get('/reset-password/:token', spaRedirectRoute('reset-password'));

// (Removed old simple redirect block; replaced by unified redirect system above)

app.use('*', (req, res) => {
	res.status(404).json({
		success: false,
		message: 'Route not found',
		availableEndpoints: { api: '/api/health', documentation: '/' },
	});
});

app.use(errorHandler);

export default app;
