import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Validate environment variables
import { validateEnvironmentVariables } from './config/validateEnv.js';
validateEnvironmentVariables();

// Import middleware
import { limiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sanitizeInput } from './middleware/sanitization.js';
import {
	detectSuspiciousActivity,
	monitorRateLimit,
} from './utils/securityMonitoring.js';

// Import routes
import authRoutes from './routes/auth.js';
import cocktailRoutes from './routes/cocktails.js';
import userRoutes from './routes/users.js';

// Import database connection
import connectDB from './config/database.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Security middleware - Enhanced helmet configuration
app.use(
	helmet({
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
				scriptSrc: ["'self'", "'unsafe-eval'"], // Required for Vite in development
				connectSrc: ["'self'", 'https://api.cloudinary.com'],
				frameSrc: ["'none'"],
				objectSrc: ["'none'"],
				mediaSrc: ["'self'"],
				manifestSrc: ["'self'"],
			},
		},
		crossOriginEmbedderPolicy: false, // Disable for Cloudinary compatibility
		crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin requests
		hsts: {
			maxAge: 31536000,
			includeSubDomains: true,
			preload: true,
		},
		noSniff: true,
		frameguard: { action: 'deny' },
		xssFilter: true,
		referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
		hidePoweredBy: true,
		ieNoOpen: true,
		dnsPrefetchControl: { allow: false },
		permittedCrossDomainPolicies: false,
	}),
);

// Additional security headers
app.use((req, res, next) => {
	// Prevent clickjacking
	res.setHeader('X-Frame-Options', 'DENY');

	// Prevent MIME type sniffing
	res.setHeader('X-Content-Type-Options', 'nosniff');

	// Enable XSS filtering
	res.setHeader('X-XSS-Protection', '1; mode=block');

	// Feature policy / Permissions policy
	res.setHeader(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
	);

	// Prevent sensitive information leakage
	res.removeHeader('X-Powered-By');
	res.removeHeader('Server');

	next();
});

// CORS configuration
const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
console.log('🌐 CORS configured for origin:', corsOrigin);

// Support multiple origins for development and production
const allowedOrigins = [
	corsOrigin,
	'https://bartendershub.com',
	'http://localhost:3000',
	'http://localhost:5173'
];

app.use(
	cors({
		origin: function (origin, callback) {
			// Allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);
			
			if (allowedOrigins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				console.warn('🚫 CORS blocked origin:', origin);
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-ID'],
	}),
);

// Rate limiting with monitoring
app.use(monitorRateLimit);
app.use(limiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization middleware with security monitoring
app.use(detectSuspiciousActivity);
app.use(sanitizeInput);

// Logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/cocktails', cocktailRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'BartendersHub API is running!',
		timestamp: new Date().toISOString(),
	});
});

// Root endpoint - API documentation/welcome
app.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to BartendersHub API! 🥃',
		version: '1.0.0',
		documentation: {
			health: '/api/health',
			auth: {
				register: 'POST /api/auth/register',
				login: 'POST /api/auth/login',
				profile: 'GET /api/auth/me',
			},
			cocktails: {
				list: 'GET /api/cocktails',
				create: 'POST /api/cocktails',
				single: 'GET /api/cocktails/:id',
			},
			users: {
				list: 'GET /api/users',
				single: 'GET /api/users/:id',
			},
		},
		frontend: process.env.FRONTEND_URL || 'Not configured',
		status: 'Production Ready',
		timestamp: new Date().toISOString(),
	});
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
	res.status(404).json({
		success: false,
		message: 'Route not found',
		availableEndpoints: {
			api: '/api/health',
			documentation: '/',
		},
	});
});

// Import WebSocket service
import websocketService from './services/websocketService.js';

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Start server (Render and other cloud platforms)
const server = app.listen(PORT, '0.0.0.0', () => {
	const isProduction = process.env.NODE_ENV === 'production';
	const baseUrl = isProduction
		? 'https://bartendershub.onrender.com'
		: `http://localhost:${PORT}`;

	console.log(`
🥃 BartendersHub API Server
🚀 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
📅 Started at: ${new Date().toLocaleString()}
🔗 Health check: ${baseUrl}/api/health
  `);
});

// Initialize WebSocket service
websocketService.initialize(server);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
	console.error('Unhandled Promise Rejection:', err);
	// Close server & exit process
	server.close(() => {
		process.exit(1);
	});
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
	process.exit(1);
});

export default app;
