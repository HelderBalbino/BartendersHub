import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML input to prevent XSS
export const sanitizeInput = (req, res, next) => {
	const sanitizeObject = (obj) => {
		if (typeof obj === 'string') {
			return DOMPurify.sanitize(obj, { ALLOWED_TAGS: [] }); // Strip all HTML tags
		}

		if (Array.isArray(obj)) {
			return obj.map(sanitizeObject);
		}

		if (obj && typeof obj === 'object') {
			const sanitized = {};
			for (const [key, value] of Object.entries(obj)) {
				sanitized[key] = sanitizeObject(value);
			}
			return sanitized;
		}

		return obj;
	};

	// Sanitize request body
	if (req.body && typeof req.body === 'object') {
		req.body = sanitizeObject(req.body);
	}

	// Sanitize query parameters
	if (req.query && typeof req.query === 'object') {
		req.query = sanitizeObject(req.query);
	}

	next();
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
