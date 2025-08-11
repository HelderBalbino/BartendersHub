// Performance monitoring utility for backend
import process from 'process';

class PerformanceMonitor {
	constructor() {
		this.metrics = new Map();
		this.requests = [];
		this.maxRequestHistory = 1000;
	}

	// Middleware to track request performance
	trackRequest() {
		return (req, res, next) => {
			const startTime = process.hrtime.bigint();
			const startMemory = process.memoryUsage();

			// Override res.end to capture completion time
			const originalEnd = res.end;
			res.end = (...args) => {
				const endTime = process.hrtime.bigint();
				const endMemory = process.memoryUsage();
				const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds

				// Log request data
				this.logRequest({
					method: req.method,
					url: req.url,
					statusCode: res.statusCode,
					duration,
					memoryDelta: endMemory.heapUsed - startMemory.heapUsed,
					userAgent: req.get('User-Agent'),
					ip: req.ip,
					timestamp: new Date().toISOString(),
				});

				// Log slow requests
				if (duration > 1000) {
					console.warn(
						`🐌 Slow request: ${req.method} ${
							req.url
						} took ${duration.toFixed(2)}ms`,
					);
				}

				// Call original end
				originalEnd.apply(res, args);
			};

			next();
		};
	}

	logRequest(requestData) {
		this.requests.unshift(requestData);

		// Keep only recent requests
		if (this.requests.length > this.maxRequestHistory) {
			this.requests = this.requests.slice(0, this.maxRequestHistory);
		}

		// Update metrics
		this.updateMetrics(requestData);
	}

	updateMetrics(requestData) {
		const key = `${requestData.method} ${requestData.url}`;

		if (!this.metrics.has(key)) {
			this.metrics.set(key, {
				count: 0,
				totalDuration: 0,
				avgDuration: 0,
				minDuration: Infinity,
				maxDuration: 0,
				errors: 0,
			});
		}

		const metric = this.metrics.get(key);
		metric.count++;
		metric.totalDuration += requestData.duration;
		metric.avgDuration = metric.totalDuration / metric.count;
		metric.minDuration = Math.min(metric.minDuration, requestData.duration);
		metric.maxDuration = Math.max(metric.maxDuration, requestData.duration);

		if (requestData.statusCode >= 400) {
			metric.errors++;
		}
	}

	// Get performance summary
	getMetrics() {
		const summary = {
			totalRequests: this.requests.length,
			averageResponseTime: this.getAverageResponseTime(),
			errorRate: this.getErrorRate(),
			slowRequests: this.getSlowRequests(),
			topEndpoints: this.getTopEndpoints(),
			memoryUsage: process.memoryUsage(),
			uptime: process.uptime(),
		};

		return summary;
	}

	getAverageResponseTime() {
		if (this.requests.length === 0) return 0;
		const total = this.requests.reduce((sum, req) => sum + req.duration, 0);
		return total / this.requests.length;
	}

	getErrorRate() {
		if (this.requests.length === 0) return 0;
		const errors = this.requests.filter(
			(req) => req.statusCode >= 400,
		).length;
		return (errors / this.requests.length) * 100;
	}

	getSlowRequests(threshold = 1000) {
		return this.requests.filter((req) => req.duration > threshold);
	}

	getTopEndpoints(limit = 10) {
		const endpointStats = new Map();

		this.requests.forEach((req) => {
			const key = `${req.method} ${req.url}`;
			if (!endpointStats.has(key)) {
				endpointStats.set(key, { count: 0, totalDuration: 0 });
			}
			const stat = endpointStats.get(key);
			stat.count++;
			stat.totalDuration += req.duration;
		});

		return Array.from(endpointStats.entries())
			.map(([endpoint, stats]) => ({
				endpoint,
				count: stats.count,
				avgDuration: stats.totalDuration / stats.count,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, limit);
	}

	// Database performance monitoring
	trackDatabaseQuery(operation, collection) {
		const start = process.hrtime.bigint();

		return {
			end: () => {
				const end = process.hrtime.bigint();
				const duration = Number(end - start) / 1000000;

				if (duration > 100) {
					// Log slow DB queries
					console.warn(
						`🗄️ Slow DB query: ${operation} on ${collection} took ${duration.toFixed(
							2,
						)}ms`,
					);
				}

				return duration;
			},
		};
	}

	// Memory usage monitoring
	checkMemoryUsage() {
		const usage = process.memoryUsage();
		const mbUsed = usage.heapUsed / 1024 / 1024;

		if (mbUsed > 512) {
			// Alert if using more than 512MB
			console.warn(`🧠 High memory usage: ${mbUsed.toFixed(2)}MB`);
		}

		return usage;
	}

	// Clear old metrics
	cleanup() {
		const oneHourAgo = Date.now() - 60 * 60 * 1000;
		this.requests = this.requests.filter(
			(req) => new Date(req.timestamp).getTime() > oneHourAgo,
		);
	}
}

export const performanceMonitor = new PerformanceMonitor();

// Cleanup old metrics every hour
setInterval(() => {
	performanceMonitor.cleanup();
}, 60 * 60 * 1000);

export default PerformanceMonitor;
