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
				scriptSrc: ["'self'"],
				connectSrc: ["'self'"],
				frameSrc: ["'none'"],
				objectSrc: ["'none'"],
				mediaSrc: ["'self'"],
				manifestSrc: ["'self'"],
			},
		},
		crossOriginEmbedderPolicy: false, // Disable for Cloudinary compatibility
		hsts: {
			maxAge: 31536000,
			includeSubDomains: true,
			preload: true,
		},
		noSniff: true,
		frameguard: { action: 'deny' },
		xssFilter: true,
		referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
	}),
);

// CORS configuration
const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
console.log('🌐 CORS configured for origin:', corsOrigin);
app.use(
	cors({
		origin: corsOrigin,
		credentials: true,
	}),
);

// Rate limiting
app.use(limiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization middleware
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

// 404 handler
app.use('*', (req, res) => {
	res.status(404).json({
		success: false,
		message: 'Route not found',
	});
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Start server (Render and other cloud platforms)
const server = app.listen(PORT, '0.0.0.0', () => {
	console.log(`
🥃 BartendersHub API Server
🚀 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
📅 Started at: ${new Date().toLocaleString()}
🔗 Health check: http://localhost:${PORT}/api/health
  `);
});

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
