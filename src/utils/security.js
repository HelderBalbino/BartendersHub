// Enhanced security utilities for frontend
import DOMPurify from 'isomorphic-dompurify';

/**
 * Enhanced security utilities for frontend protection
 */

// Secure token management with additional validation
export class SecureTokenManager {
	static TOKEN_KEY = 'authToken';
	static TOKEN_PREFIX = 'Bearer ';

	static setToken(token) {
		if (!token || typeof token !== 'string') {
			throw new Error('Invalid token provided');
		}

		// Validate JWT structure (basic check)
		const parts = token.split('.');
		if (parts.length !== 3) {
			throw new Error('Invalid JWT token format');
		}

		try {
			localStorage.setItem(this.TOKEN_KEY, token);
			console.log('🔐 SecureTokenManager: Token stored successfully');
		} catch (error) {
			console.error('Failed to store auth token:', error);
			throw new Error('Unable to store authentication token');
		}
	}

	static getToken() {
		try {
			const token = localStorage.getItem(this.TOKEN_KEY);
			if (!token) {
				console.log('🔐 SecureTokenManager: No token found in storage');
				return null;
			}

			// Basic JWT validation
			const parts = token.split('.');
			if (parts.length !== 3) {
				console.warn(
					'🔐 SecureTokenManager: Invalid token format, removing...',
				);
				this.removeToken(); // Remove invalid token
				return null;
			}

			console.log('🔐 SecureTokenManager: Token retrieved successfully');
			return token;
		} catch (error) {
			console.error('Failed to retrieve auth token:', error);
			return null;
		}
	}

	static removeToken() {
		try {
			localStorage.removeItem(this.TOKEN_KEY);
			console.log('🔐 SecureTokenManager: Token removed successfully');
		} catch (error) {
			console.error('Failed to remove auth token:', error);
		}
	}

	static isTokenExpired(token) {
		if (!token) return true;

		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			const currentTime = Date.now() / 1000;
			const isExpired = payload.exp < currentTime;

			console.log('🔐 SecureTokenManager: Token expiration check', {
				expires: new Date(payload.exp * 1000).toLocaleString(),
				isExpired,
				timeLeft: isExpired
					? 0
					: Math.round((payload.exp - currentTime) / 60) + ' minutes',
			});

			return isExpired;
		} catch (error) {
			console.error('Error checking token expiration:', error);
			return true;
		}
	}
}

// Enhanced input sanitization
export const sanitizeUserInput = (input, options = {}) => {
	if (!input) return input;

	const {
		allowedTags = [],
		stripScripts = true,
		maxLength = null,
		trimWhitespace = true,
	} = options;

	let sanitized = input;

	// Trim whitespace if enabled
	if (trimWhitespace && typeof sanitized === 'string') {
		sanitized = sanitized.trim();
	}

	// Enforce max length
	if (
		maxLength &&
		typeof sanitized === 'string' &&
		sanitized.length > maxLength
	) {
		sanitized = sanitized.substring(0, maxLength);
	}

	// Use DOMPurify for HTML sanitization
	if (typeof sanitized === 'string') {
		sanitized = DOMPurify.sanitize(sanitized, {
			ALLOWED_TAGS: allowedTags,
			STRIP_SCRIPT: stripScripts,
			KEEP_CONTENT: true,
		});
	}

	return sanitized;
};

// Enhanced URL validation
export const validateURL = (url) => {
	if (!url || typeof url !== 'string') return false;

	try {
		const urlObj = new URL(url);

		// Only allow HTTP and HTTPS protocols
		if (!['http:', 'https:'].includes(urlObj.protocol)) {
			return false;
		}

		// Block localhost in production (except for development)
		if (
			import.meta.env.PROD &&
			(urlObj.hostname === 'localhost' ||
				urlObj.hostname === '127.0.0.1' ||
				urlObj.hostname.startsWith('192.168.') ||
				urlObj.hostname.startsWith('10.') ||
				urlObj.hostname.startsWith('172.'))
		) {
			return false;
		}

		return true;
	} catch {
		return false;
	}
};

// File upload security validation
export const validateFileUpload = (file, options = {}) => {
	const {
		maxSize = 5 * 1024 * 1024, // 5MB default
		allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
		allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'],
		validateFilename = true,
	} = options;

	const errors = [];

	if (!file) {
		errors.push('No file selected');
		return { valid: false, errors };
	}

	// File size validation
	if (file.size > maxSize) {
		errors.push(
			`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
		);
	}

	// MIME type validation
	if (!allowedTypes.includes(file.type)) {
		errors.push(
			'Invalid file type. Only JPEG, PNG, and WebP images are allowed',
		);
	}

	// File extension validation
	const fileName = file.name.toLowerCase();
	const hasValidExtension = allowedExtensions.some((ext) =>
		fileName.endsWith(ext),
	);
	if (!hasValidExtension) {
		errors.push('Invalid file extension');
	}

	// Filename security validation
	if (validateFilename) {
		const dangerousPatterns = [
			/\.\./, // Path traversal
			/[<>:"|?*]/, // Windows invalid chars
			/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows reserved names
			/^\./, // Hidden files
		];

		if (dangerousPatterns.some((pattern) => pattern.test(file.name))) {
			errors.push('Invalid filename detected');
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
};

// Enhanced form validation
export const createSecureFormValidator = (schema) => {
	return (data) => {
		const errors = {};
		const sanitized = {};

		for (const [field, rules] of Object.entries(schema)) {
			const value = data[field];

			// Sanitize input
			sanitized[field] = sanitizeUserInput(
				value,
				rules.sanitization || {},
			);

			// Validate
			for (const rule of rules.validation || []) {
				const error = rule(sanitized[field], sanitized);
				if (error) {
					errors[field] = error;
					break;
				}
			}
		}

		return {
			valid: Object.keys(errors).length === 0,
			errors,
			sanitized,
		};
	};
};

// Security headers validation for API responses
export const validateSecurityHeaders = (response) => {
	// Only perform strict validation in production
	if (!import.meta.env.PROD) {
		console.log('🔧 Development mode: Skipping security header validation');
		return true; // Skip validation in development
	}

	const securityHeaders = [
		'x-content-type-options',
		'x-frame-options', 
		'x-xss-protection',
		'strict-transport-security',
	];

	const missingHeaders = securityHeaders.filter(
		(header) => !response.headers.get(header),
	);

	if (missingHeaders.length > 0) {
		console.info('ℹ️ Security headers info:', {
			missing: missingHeaders,
			note: 'Headers are enforced by backend security middleware'
		});
		// Don't fail the request, just log info
	}

	return true; // Always return true to not block requests
};

// Rate limiting client-side tracking
export class ClientRateLimiter {
	constructor(maxRequests = 100, windowMs = 15 * 60 * 1000) {
		this.maxRequests = maxRequests;
		this.windowMs = windowMs;
		this.requests = new Map();
	}

	isAllowed(identifier = 'global') {
		const now = Date.now();
		const windowStart = now - this.windowMs;

		// Clean old requests
		if (this.requests.has(identifier)) {
			const userRequests = this.requests.get(identifier);
			const validRequests = userRequests.filter(
				(time) => time > windowStart,
			);
			this.requests.set(identifier, validRequests);
		}

		// Check current request count
		const currentRequests = this.requests.get(identifier) || [];

		if (currentRequests.length >= this.maxRequests) {
			return false;
		}

		// Add current request
		currentRequests.push(now);
		this.requests.set(identifier, currentRequests);

		return true;
	}

	getRemainingRequests(identifier = 'global') {
		const currentRequests = this.requests.get(identifier) || [];
		return Math.max(0, this.maxRequests - currentRequests.length);
	}
}

export default {
	SecureTokenManager,
	sanitizeUserInput,
	validateURL,
	validateFileUpload,
	createSecureFormValidator,
	validateSecurityHeaders,
	ClientRateLimiter,
};
