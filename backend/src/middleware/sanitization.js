import DOMPurify from 'isomorphic-dompurify';

// Enhanced input sanitization middleware
export const sanitizeInput = (req, res, next) => {
	const sanitizeObject = (obj, depth = 0) => {
		// Prevent deep recursion attacks
		if (depth > 10) {
			throw new Error('Object nesting too deep');
		}

		if (typeof obj === 'string') {
			// Trim whitespace
			let sanitized = obj.trim();

			// Prevent excessively long strings
			if (sanitized.length > 10000) {
				sanitized = sanitized.substring(0, 10000);
			}

			// Sanitize HTML/XSS
			sanitized = DOMPurify.sanitize(sanitized, {
				ALLOWED_TAGS: [],
				ALLOWED_ATTR: [],
				STRIP_SCRIPT: true,
				KEEP_CONTENT: true,
			});

			// Additional XSS prevention
			sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
			sanitized = sanitized.replace(/javascript:/gi, '');
			sanitized = sanitized.replace(/on\w+\s*=/gi, '');

			return sanitized;
		}

		if (Array.isArray(obj)) {
			// Limit array size to prevent DoS
			if (obj.length > 1000) {
				throw new Error('Array too large');
			}
			return obj.map((item) => sanitizeObject(item, depth + 1));
		}

		if (obj && typeof obj === 'object') {
			// Limit object size to prevent DoS
			const keys = Object.keys(obj);
			if (keys.length > 100) {
				throw new Error('Object has too many properties');
			}

			const sanitized = {};
			for (const [key, value] of Object.entries(obj)) {
				// Sanitize key names
				const sanitizedKey = key.replace(/[^\w.-]/g, '');
				if (sanitizedKey !== key) {
					console.warn(
						`Suspicious key detected and sanitized: ${key} -> ${sanitizedKey}`,
					);
				}
				sanitized[sanitizedKey] = sanitizeObject(value, depth + 1);
			}
			return sanitized;
		}

		return obj;
	};

	try {
		// Sanitize request body
		if (req.body && typeof req.body === 'object') {
			req.body = sanitizeObject(req.body);
		}

		// Sanitize query parameters
		if (req.query && typeof req.query === 'object') {
			req.query = sanitizeObject(req.query);
		}

		// Sanitize URL parameters
		if (req.params && typeof req.params === 'object') {
			req.params = sanitizeObject(req.params);
		}

		next();
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: 'Invalid request data',
			error: error.message,
		});
	}
};

// Validate and sanitize file uploads
export const validateFileUpload = (req, res, next) => {
	if (req.file) {
		const file = req.file;

		// Check file size (5MB limit)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			return res.status(400).json({
				success: false,
				message: 'File size too large. Maximum size is 5MB.',
			});
		}

		// Check file type
		const allowedMimeTypes = [
			'image/jpeg',
			'image/jpg',
			'image/png',
			'image/webp',
		];

		if (!allowedMimeTypes.includes(file.mimetype)) {
			return res.status(400).json({
				success: false,
				message:
					'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
			});
		}

		// Sanitize filename
		file.filename = file.filename.replace(/[^a-zA-Z0-9.-]/g, '');
	}

	next();
};
