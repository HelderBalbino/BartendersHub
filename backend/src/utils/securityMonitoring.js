import process from 'process';

/**
 * Security monitoring and logging utilities
 */

// Security event types
export const SECURITY_EVENTS = {
	LOGIN_ATTEMPT: 'login_attempt',
	LOGIN_FAILURE: 'login_failure',
	RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
	SUSPICIOUS_FILE_UPLOAD: 'suspicious_file_upload',
	XSS_ATTEMPT: 'xss_attempt',
	SQL_INJECTION_ATTEMPT: 'sql_injection_attempt',
	PATH_TRAVERSAL_ATTEMPT: 'path_traversal_attempt',
	INVALID_TOKEN: 'invalid_token',
	ACCOUNT_LOCKOUT: 'account_lockout',
	PRIVILEGE_ESCALATION: 'privilege_escalation',
};

// Security logger class
class SecurityLogger {
	constructor() {
		this.logLevel = process.env.LOG_LEVEL || 'info';
		this.environment = process.env.NODE_ENV || 'development';
	}

	log(event, details = {}) {
		const logEntry = {
			timestamp: new Date().toISOString(),
			event,
			level: this.getEventLevel(event),
			environment: this.environment,
			...details,
		};

		// In production, you would send this to a logging service
		if (this.shouldLog(logEntry.level)) {
			console.log(`🔒 SECURITY: ${JSON.stringify(logEntry)}`);
		}

		// Alert for critical security events
		if (this.isCriticalEvent(event)) {
			this.alertCriticalEvent(logEntry);
		}
	}

	getEventLevel(event) {
		const criticalEvents = [
			SECURITY_EVENTS.SQL_INJECTION_ATTEMPT,
			SECURITY_EVENTS.PATH_TRAVERSAL_ATTEMPT,
			SECURITY_EVENTS.PRIVILEGE_ESCALATION,
		];

		const warningEvents = [
			SECURITY_EVENTS.LOGIN_FAILURE,
			SECURITY_EVENTS.RATE_LIMIT_EXCEEDED,
			SECURITY_EVENTS.XSS_ATTEMPT,
			SECURITY_EVENTS.SUSPICIOUS_FILE_UPLOAD,
			SECURITY_EVENTS.INVALID_TOKEN,
		];

		if (criticalEvents.includes(event)) return 'critical';
		if (warningEvents.includes(event)) return 'warning';
		return 'info';
	}

	shouldLog(level) {
		const levels = ['debug', 'info', 'warning', 'critical'];
		const currentLevelIndex = levels.indexOf(this.logLevel);
		const eventLevelIndex = levels.indexOf(level);
		return eventLevelIndex >= currentLevelIndex;
	}

	isCriticalEvent(event) {
		return this.getEventLevel(event) === 'critical';
	}

	alertCriticalEvent(logEntry) {
		// In production, send alerts via email, Slack, etc.
		console.error(
			`🚨 CRITICAL SECURITY EVENT: ${JSON.stringify(logEntry)}`,
		);

		// You could integrate with services like:
		// - Email notifications
		// - Slack webhooks
		// - PagerDuty
		// - Custom monitoring systems
	}
}

// Global security logger instance
export const securityLogger = new SecurityLogger();

// Middleware to log security events
export const logSecurityEvent = (event) => {
	return (req, res, next) => {
		const details = {
			ip: req.ip || req.connection.remoteAddress,
			userAgent: req.headers['user-agent'],
			url: req.url,
			method: req.method,
			userId: req.user?.id || null,
			sessionId: req.sessionKey || null,
		};

		securityLogger.log(event, details);
		next();
	};
};

// Detect suspicious patterns in requests
export const detectSuspiciousActivity = (req, res, next) => {
	const suspiciousPatterns = [
		// SQL Injection patterns
		/('|(\\?))|(\\?)|('$)/i,
		/(union|select|insert|delete|update|drop|create|alter|exec|script)/i,

		// XSS patterns
		/<script[^>]*>.*?<\/script>/gi,
		/javascript:/gi,
		/on\w+\s*=/gi,

		// Path traversal patterns
		/\.\.[/\\]/g,
		/(\.\.%2f|\.\.%5c)/gi,

		// Command injection patterns
		/[;&|`$]/g,
	];

	const checkString = (str, context) => {
		if (typeof str !== 'string') return;

		for (const pattern of suspiciousPatterns) {
			if (pattern.test(str)) {
				securityLogger.log(SECURITY_EVENTS.XSS_ATTEMPT, {
					ip: req.ip,
					userAgent: req.headers['user-agent'],
					url: req.url,
					suspiciousInput: str.substring(0, 100), // Log first 100 chars
					context,
					pattern: pattern.toString(),
				});
				break;
			}
		}
	};

	// Check various request parts
	if (req.body) {
		JSON.stringify(req.body)
			.split('')
			.forEach((char, index) => {
				// Sample check to avoid performance issues
				if (index % 100 === 0) {
					checkString(
						JSON.stringify(req.body).substring(index, index + 100),
						'request_body',
					);
				}
			});
	}

	if (req.query) {
		Object.entries(req.query).forEach(([key, value]) => {
			checkString(key, 'query_key');
			checkString(value, 'query_value');
		});
	}

	if (req.params) {
		Object.entries(req.params).forEach(([key, value]) => {
			checkString(key, 'param_key');
			checkString(value, 'param_value');
		});
	}

	next();
};

// Monitor for rate limit violations
export const monitorRateLimit = (req, res, next) => {
	const originalSend = res.send;

	res.send = function (data) {
		if (this.statusCode === 429) {
			securityLogger.log(SECURITY_EVENTS.RATE_LIMIT_EXCEEDED, {
				ip: req.ip,
				userAgent: req.headers['user-agent'],
				url: req.url,
				method: req.method,
			});
		}
		return originalSend.call(this, data);
	};

	next();
};

// File upload security monitoring
export const monitorFileUploads = (req, res, next) => {
	if (req.file || req.files) {
		const files = req.files || [req.file];

		files.forEach((file) => {
			// Check for suspicious file types
			const suspiciousExtensions = [
				'.exe',
				'.bat',
				'.cmd',
				'.scr',
				'.pif',
				'.jar',
			];
			const hasExtension = suspiciousExtensions.some((ext) =>
				file.originalname.toLowerCase().endsWith(ext),
			);

			// Check for double extensions
			const doubleExtension = /\.[a-z]{2,4}\.[a-z]{2,4}$/i.test(
				file.originalname,
			);

			if (hasExtension || doubleExtension) {
				securityLogger.log(SECURITY_EVENTS.SUSPICIOUS_FILE_UPLOAD, {
					ip: req.ip,
					userAgent: req.headers['user-agent'],
					filename: file.originalname,
					mimetype: file.mimetype,
					size: file.size,
					userId: req.user?.id || null,
				});
			}
		});
	}

	next();
};

export default {
	securityLogger,
	SECURITY_EVENTS,
	logSecurityEvent,
	detectSuspiciousActivity,
	monitorRateLimit,
	monitorFileUploads,
};
