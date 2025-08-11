// Production-ready error monitoring and logging utility
class ErrorMonitor {
	constructor() {
		this.errors = [];
		this.maxErrors = 100;
		this.isProduction = import.meta.env.NODE_ENV === 'production';

		// Initialize error tracking
		this.setupGlobalErrorHandlers();
	}

	setupGlobalErrorHandlers() {
		// Catch unhandled Promise rejections
		window.addEventListener('unhandledrejection', (event) => {
			this.logError(event.reason, 'unhandledrejection');
			event.preventDefault(); // Prevent console logging in production
		});

		// Catch JavaScript errors
		window.addEventListener('error', (event) => {
			this.logError(event.error, 'javascript', {
				filename: event.filename,
				lineno: event.lineno,
				colno: event.colno,
			});
		});

		// Catch React Error Boundary errors
		window.addEventListener('react-error', (event) => {
			this.logError(event.detail.error, 'react', event.detail.errorInfo);
		});
	}

	logError(error, type = 'unknown', context = {}) {
		const errorData = {
			id: this.generateId(),
			timestamp: new Date().toISOString(),
			type,
			message: error?.message || String(error),
			stack: error?.stack,
			context,
			userAgent: navigator.userAgent,
			url: window.location.href,
		};

		// Store error locally
		this.addError(errorData);

		// In production, send to monitoring service
		if (this.isProduction) {
			this.sendToMonitoringService(errorData);
		} else {
			// In development, log to console with formatting
			console.group(`🚨 Error [${type}]`);
			console.error('Message:', errorData.message);
			console.error('Stack:', errorData.stack);
			console.error('Context:', errorData.context);
			console.groupEnd();
		}
	}

	addError(error) {
		this.errors.unshift(error);

		// Keep only the most recent errors
		if (this.errors.length > this.maxErrors) {
			this.errors = this.errors.slice(0, this.maxErrors);
		}

		// Store in localStorage for debugging
		try {
			localStorage.setItem(
				'bartendershub_errors',
				JSON.stringify(this.errors.slice(0, 10)),
			);
		} catch {
			// Ignore localStorage errors
		}
	}

	async sendToMonitoringService(errorData) {
		try {
			// Replace with actual monitoring service endpoint
			await fetch('/api/errors', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(errorData),
			});
		} catch {
			// Silently fail to avoid infinite error loops
		}
	}

	generateId() {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	}

	// Get recent errors for debugging
	getRecentErrors(limit = 10) {
		return this.errors.slice(0, limit);
	}

	// Clear error history
	clearErrors() {
		this.errors = [];
		localStorage.removeItem('bartendershub_errors');
	}

	// Performance monitoring
	measurePerformance(name, fn) {
		const start = performance.now();

		try {
			const result = fn();

			// Handle async functions
			if (result && typeof result.then === 'function') {
				return result.finally(() => {
					const duration = performance.now() - start;
					this.logPerformance(name, duration);
				});
			}

			const duration = performance.now() - start;
			this.logPerformance(name, duration);
			return result;
		} catch (error) {
			const duration = performance.now() - start;
			this.logError(error, 'performance', { operation: name, duration });
			throw error;
		}
	}

	logPerformance(name, duration) {
		if (duration > 1000) {
			// Log operations taking more than 1 second
			console.warn(
				`🐌 Slow operation: ${name} took ${duration.toFixed(2)}ms`,
			);
		}

		// Store performance data
		const perfData = {
			name,
			duration,
			timestamp: Date.now(),
		};

		try {
			const perfHistory = JSON.parse(
				localStorage.getItem('bartendershub_performance') || '[]',
			);
			perfHistory.unshift(perfData);
			localStorage.setItem(
				'bartendershub_performance',
				JSON.stringify(perfHistory.slice(0, 50)),
			);
		} catch {
			// Ignore localStorage errors
		}
	}
}

// Create global instance
const errorMonitor = new ErrorMonitor();

// Export utility functions
export const logError = (error, type, context) =>
	errorMonitor.logError(error, type, context);
export const measurePerformance = (name, fn) =>
	errorMonitor.measurePerformance(name, fn);
export const getRecentErrors = (limit) => errorMonitor.getRecentErrors(limit);
export const clearErrors = () => errorMonitor.clearErrors();

export default errorMonitor;
