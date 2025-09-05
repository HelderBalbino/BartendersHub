// Standard response helpers middleware
export const responseHelpers = (req, res, next) => {
	res.success = (data, meta = {}, status = 200) => {
		if (!res.headersSent) {
			const isPlainObject =
				data && typeof data === 'object' && !Array.isArray(data);
			// Hoist data fields (like token, user) for backward compatibility
			const hoistedData = isPlainObject ? { ...data } : {};
			// Hoist meta fields (message, count, cursor, etc.) for convenience
			const hoistedMeta = meta && typeof meta === 'object' ? { ...meta } : {};
			return res
				.status(status)
				.json({ success: true, ...hoistedData, ...hoistedMeta, data, meta });
		}
	};
	res.fail = (status, message, code = 'ERROR', extra = {}) => {
		if (!res.headersSent) {
			return res.status(status).json({
				success: false,
				message,
				code,
				error: { message, code, ...extra },
			});
		}
	};
	next();
};

// Guard that enforces verified email for protected interactions
export const requireVerified = (req, res, next) => {
	if (!req.user) return res.fail(401, 'Authentication required', 'AUTH');
	if (!req.user.isVerified)
		return res.fail(403, 'Email verification required', 'UNVERIFIED');
	next();
};
