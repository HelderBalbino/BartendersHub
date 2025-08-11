import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import process from 'process';

// Track active sessions (in production, use Redis)
// const _activeSessions = new Map(); // Reserved for future session management
const loginAttempts = new Map();

// Protect routes - Authentication middleware
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

			// Get user from token
			req.user = await User.findById(decoded.id);

			if (!req.user) {
				return res.status(401).json({
					success: false,
					message: 'Not authorized to access this route',
				});
			}

			next();
		} catch {
			return res.status(401).json({
				success: false,
				message: 'Not authorized to access this route',
			});
		}
	} catch {
		return res.status(500).json({
			success: false,
			message: 'Server error',
		});
	}
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

// Enhanced auth functions from enhancedAuth.js
export const trackLoginAttempts = (req, res, next) => {
	const ip = req.ip;
	const maxAttempts = 5;
	const windowTime = 15 * 60 * 1000; // 15 minutes

	if (!loginAttempts.has(ip)) {
		loginAttempts.set(ip, { count: 0, lastAttempt: Date.now() });
	}

	const attempts = loginAttempts.get(ip);

	// Reset if window expired
	if (Date.now() - attempts.lastAttempt > windowTime) {
		attempts.count = 0;
		attempts.lastAttempt = Date.now();
	}

	// Check if too many attempts
	if (attempts.count >= maxAttempts) {
		return res.status(429).json({
			success: false,
			message: 'Too many login attempts. Please try again later.',
		});
	}

	next();
};

export const validatePasswordStrength = (req, res, next) => {
	const { password } = req.body;

	if (!password) {
		return next();
	}

	const minLength = 8;
	const hasUppercase = /[A-Z]/.test(password);
	const hasLowercase = /[a-z]/.test(password);
	const hasNumbers = /\d/.test(password);
	const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

	if (password.length < minLength) {
		return res.status(400).json({
			success: false,
			message: 'Password must be at least 8 characters long',
		});
	}

	if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecial) {
		return res.status(400).json({
			success: false,
			message:
				'Password must contain uppercase, lowercase, numbers, and special characters',
		});
	}

	next();
};
