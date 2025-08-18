import { validationResult } from 'express-validator';
import process from 'process';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: 'Validation failed',
			errors: errors.array(),
			timestamp: new Date().toISOString(),
		});
	}

	next();
};

// Enhanced global error handler with better logging and monitoring
export const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;
	// Reference next param subtly so it's not flagged as unused (express error handlers need 4 args)
	void typeof next;

	// Enhanced error logging with request context
	const errorContext = {
		message: err.message,
		stack: err.stack,
		method: req.method,
		url: req.url,
		userAgent: req.get('User-Agent'),
		ip: req.ip,
		timestamp: new Date().toISOString(),
		userId: req.user?.id || 'anonymous',
	};

	// Log based on environment
	if (process.env.NODE_ENV === 'development') {
		console.error('🚨 Error Details:', errorContext);
	} else {
		// In production, log less sensitive information
		console.error('🚨 Error:', {
			message: err.message,
			method: req.method,
			url: req.url,
			timestamp: errorContext.timestamp,
		});
	}

	// Mongoose bad ObjectId
	if (err.name === 'CastError') {
		const message = 'Resource not found';
		error = {
			message,
			statusCode: 404,
		};
	}

	// Mongoose duplicate key
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue || {})[0] || 'field';
		const message = `Duplicate ${field} value entered`;
		error = {
			message,
			statusCode: 400,
		};
	}

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((val) => val.message);
		error = {
			message: Array.isArray(message) ? message.join(', ') : message,
			statusCode: 400,
		};
	}

	// JWT errors
	if (err.name === 'JsonWebTokenError') {
		error = {
			message: 'Invalid token',
			statusCode: 401,
		};
	}

	if (err.name === 'TokenExpiredError') {
		error = {
			message: 'Token expired',
			statusCode: 401,
		};
	}

	// File upload errors
	if (err.code === 'LIMIT_FILE_SIZE') {
		error = {
			message: 'File too large',
			statusCode: 413,
		};
	}

	// Database connection errors
	if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
		error = {
			message: 'Database connection error',
			statusCode: 503,
		};
	}

	// Rate limiting errors
	if (err.statusCode === 429) {
		error = {
			message: 'Too many requests',
			statusCode: 429,
		};
	}

	const statusCode = error.statusCode || 500;
	const message = error.message || 'Server Error';

	// Send appropriate response based on environment
	const response = {
		success: false,
		message,
		timestamp: new Date().toISOString(),
	};

	// Include stack trace in development
	if (process.env.NODE_ENV === 'development') {
		response.stack = err.stack;
		response.context = errorContext;
	}

	// Include error ID for tracking in production
	if (process.env.NODE_ENV === 'production') {
		response.errorId =
			Date.now().toString(36) + Math.random().toString(36).substr(2);
	}

	res.status(statusCode).json(response);
};
