import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import process from 'process';

// Enhanced security middleware

// Track active sessions (in production, use Redis)
const activeSessions = new Map();

// Enhanced authentication middleware with session tracking
export const protect = async (req, res, next) => {
	try {
		let token;

		// Check if token exists in headers
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			token = req.headers.authorization.split(' ')[1];
		}

		// Make sure token exists
		if (!token) {
			return res.status(401).json({
				success: false,
				message: 'Not authorized to access this route',
			});
		}

		try {
			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Check if session is still active (in production, check Redis)
			const sessionKey = `${decoded.id}_${token.substring(0, 10)}`;
			if (!activeSessions.has(sessionKey)) {
				return res.status(401).json({
					success: false,
					message: 'Session expired. Please log in again.',
				});
			}

			// Get user from token
			const user = await User.findById(decoded.id);

			if (!user) {
				return res.status(401).json({
					success: false,
					message: 'User no longer exists',
				});
			}

			// Check if user is active (not banned/suspended)
			if (user.status && user.status === 'suspended') {
				return res.status(403).json({
					success: false,
					message: 'Account suspended. Contact support.',
				});
			}

			// Update last activity
			activeSessions.set(sessionKey, {
				userId: decoded.id,
				lastActivity: new Date(),
				userAgent: req.headers['user-agent'],
				ip: req.ip || req.connection.remoteAddress,
			});

			req.user = user;
			req.sessionKey = sessionKey;
			next();
		} catch (error) {
			return res.status(401).json({
				success: false,
				message: 'Invalid or expired token',
			});
		}
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Server error during authentication',
		});
	}
};

// Session management utilities
export const createSession = (userId, token) => {
	const sessionKey = `${userId}_${token.substring(0, 10)}`;
	activeSessions.set(sessionKey, {
		userId,
		createdAt: new Date(),
		lastActivity: new Date(),
		userAgent: null,
		ip: null,
	});
	return sessionKey;
};

export const removeSession = (sessionKey) => {
	activeSessions.delete(sessionKey);
};

export const removeAllUserSessions = (userId) => {
	for (const [key, session] of activeSessions.entries()) {
		if (session.userId === userId) {
			activeSessions.delete(key);
		}
	}
};

// Enhanced logout middleware
export const logout = (req, res, next) => {
	if (req.sessionKey) {
		removeSession(req.sessionKey);
	}
	next();
};

// Account lockout middleware (prevent brute force)
const loginAttempts = new Map();

export const trackLoginAttempts = (req, res, next) => {
	const identifier = req.ip || req.connection.remoteAddress;
	const now = Date.now();
	const windowMs = 15 * 60 * 1000; // 15 minutes
	const maxAttempts = 5;

	if (!loginAttempts.has(identifier)) {
		loginAttempts.set(identifier, []);
	}

	const attempts = loginAttempts.get(identifier);

	// Clean old attempts
	const validAttempts = attempts.filter((time) => time > now - windowMs);
	loginAttempts.set(identifier, validAttempts);

	if (validAttempts.length >= maxAttempts) {
		return res.status(429).json({
			success: false,
			message: 'Too many failed login attempts. Please try again later.',
		});
	}

	// Add current attempt on failure
	res.on('finish', () => {
		if (res.statusCode === 401) {
			validAttempts.push(now);
			loginAttempts.set(identifier, validAttempts);
		} else if (res.statusCode === 200) {
			// Clear attempts on successful login
			loginAttempts.delete(identifier);
		}
	});

	next();
};

// Grant access to specific roles
export const authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: `User role ${req.user.role} is not authorized to access this route`,
			});
		}
		next();
	};
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
	if (!req.user.isAdmin) {
		return res.status(403).json({
			success: false,
			message: 'Admin access required',
		});
	}
	next();
};

// Enhanced password validation middleware
export const validatePasswordStrength = (req, res, next) => {
	const { password } = req.body;

	if (!password) {
		return next();
	}

	const errors = [];

	// Length check
	if (password.length < 8) {
		errors.push('Password must be at least 8 characters long');
	}

	if (password.length > 128) {
		errors.push('Password must be no more than 128 characters long');
	}

	// Complexity checks
	if (!/[a-z]/.test(password)) {
		errors.push('Password must contain at least one lowercase letter');
	}

	if (!/[A-Z]/.test(password)) {
		errors.push('Password must contain at least one uppercase letter');
	}

	if (!/\d/.test(password)) {
		errors.push('Password must contain at least one number');
	}

	if (!/[@$!%*?&]/.test(password)) {
		errors.push(
			'Password must contain at least one special character (@$!%*?&)',
		);
	}

	// Common password check
	const commonPasswords = [
		'password',
		'password123',
		'123456',
		'123456789',
		'qwerty',
		'abc123',
		'password1',
		'admin',
		'letmein',
		'welcome',
	];

	if (commonPasswords.includes(password.toLowerCase())) {
		errors.push(
			'Password is too common. Please choose a more secure password',
		);
	}

	// Check for sequential characters
	if (/123456|abcdef|qwerty/.test(password.toLowerCase())) {
		errors.push('Password cannot contain sequential characters');
	}

	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			message: 'Password does not meet security requirements',
			errors,
		});
	}

	next();
};

// CSRF protection for state-changing operations
export const csrfProtection = (req, res, next) => {
	const allowedMethods = ['GET', 'HEAD', 'OPTIONS'];

	if (allowedMethods.includes(req.method)) {
		return next();
	}

	const origin = req.headers.origin;
	const referer = req.headers.referer;
	const host = req.headers.host;

	// Check Origin header
	if (origin) {
		const originUrl = new URL(origin);
		if (originUrl.host !== host) {
			return res.status(403).json({
				success: false,
				message: 'Invalid origin',
			});
		}
	}

	// Check Referer header as fallback
	if (!origin && referer) {
		const refererUrl = new URL(referer);
		if (refererUrl.host !== host) {
			return res.status(403).json({
				success: false,
				message: 'Invalid referer',
			});
		}
	}

	next();
};

export default {
	protect,
	createSession,
	removeSession,
	removeAllUserSessions,
	logout,
	trackLoginAttempts,
	authorize,
	isAdmin,
	validatePasswordStrength,
	csrfProtection,
};
