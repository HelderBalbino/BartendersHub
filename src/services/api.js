import axios from 'axios';
import config from '../config/environment.js';
import { logError, measurePerformance } from '../utils/errorMonitoring.js';

// Enhanced API service with better error handling, caching, and performance monitoring
class ApiService {
	constructor() {
		this.baseURL = config.api.baseURL;
		this.timeout = config.api.timeout;
		this.cache = new Map();
		this.pendingRequests = new Map();

		// Create axios instance with optimized configuration
		this.client = axios.create({
			baseURL: this.baseURL,
			timeout: this.timeout,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		this.setupInterceptors();
		this.setupCacheCleanup();
	}

	setupInterceptors() {
		// Request interceptor for authentication and performance tracking
		this.client.interceptors.request.use(
			(config) => {
				// Add auth token if available
				const token = this.getAuthToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}

				// Add performance tracking
				config.metadata = { startTime: Date.now() };

				// Add request ID for debugging
				config.headers['X-Request-ID'] = this.generateRequestId();

				return config;
			},
			(error) => {
				logError(error, 'request-interceptor');
				return Promise.reject(error);
			},
		);

		// Response interceptor for error handling and performance tracking
		this.client.interceptors.response.use(
			(response) => {
				// Track response time
				const duration =
					Date.now() - response.config.metadata.startTime;
				if (duration > 3000) {
					console.warn(
						`🐌 Slow API request: ${response.config.url} took ${duration}ms`,
					);
				}

				return response;
			},
			(error) => {
				// Enhanced error handling
				const enhancedError = this.enhanceError(error);
				logError(enhancedError, 'api-response');
				return Promise.reject(enhancedError);
			},
		);
	}

	setupCacheCleanup() {
		// Clear cache every 30 minutes
		setInterval(() => {
			this.cache.clear();
		}, 30 * 60 * 1000);
	}

	enhanceError(error) {
		const enhanced = {
			...error,
			timestamp: new Date().toISOString(),
			requestId: error.config?.headers?.['X-Request-ID'],
		};

		if (error.response) {
			enhanced.status = error.response.status;
			enhanced.statusText = error.response.statusText;
			enhanced.data = error.response.data;
		} else if (error.request) {
			enhanced.type = 'network';
			enhanced.message = 'Network error - please check your connection';
		} else {
			enhanced.type = 'config';
		}

		return enhanced;
	}

	getAuthToken() {
		// Try multiple storage locations
		return (
			localStorage.getItem('token') ||
			sessionStorage.getItem('token') ||
			document.cookie
				.split('; ')
				.find((row) => row.startsWith('token='))
				?.split('=')[1]
		);
	}

	generateRequestId() {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	}

	// Generic request method with caching and deduplication
	async request(method, url, data = null, options = {}) {
		const cacheKey = `${method}:${url}:${JSON.stringify(data)}`;
		const {
			cache = method === 'GET',
			cacheTTL = 5 * 60 * 1000, // 5 minutes
			...requestOptions
		} = options;

		// Check cache for GET requests
		if (cache && method === 'GET') {
			const cached = this.cache.get(cacheKey);
			if (cached && Date.now() - cached.timestamp < cacheTTL) {
				return cached.data;
			}
		}

		// Check for pending identical requests (deduplication)
		if (this.pendingRequests.has(cacheKey)) {
			return this.pendingRequests.get(cacheKey);
		}

		// Create request promise
		const requestPromise = measurePerformance(
			`API:${method}:${url}`,
			async () => {
				try {
					const response = await this.client.request({
						method,
						url,
						data,
						...requestOptions,
					});

					// Cache successful GET responses
					if (cache && method === 'GET' && response.status === 200) {
						this.cache.set(cacheKey, {
							data: response.data,
							timestamp: Date.now(),
						});
					}

					return response.data;
				} finally {
					// Remove from pending requests
					this.pendingRequests.delete(cacheKey);
				}
			},
		);

		// Store pending request
		this.pendingRequests.set(cacheKey, requestPromise);

		return requestPromise;
	}

	// Optimized HTTP methods
	async get(url, options = {}) {
		return this.request('GET', url, null, options);
	}

	async post(url, data, options = {}) {
		return this.request('POST', url, data, { cache: false, ...options });
	}

	async put(url, data, options = {}) {
		return this.request('PUT', url, data, { cache: false, ...options });
	}

	async patch(url, data, options = {}) {
		return this.request('PATCH', url, data, { cache: false, ...options });
	}

	async delete(url, options = {}) {
		return this.request('DELETE', url, null, { cache: false, ...options });
	}

	// File upload with progress tracking
	async uploadFile(url, file, options = {}) {
		const formData = new FormData();
		formData.append('file', file);

		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			onUploadProgress: options.onProgress,
			...options,
		};

		return measurePerformance('API:upload', () =>
			this.request('POST', url, formData, config),
		);
	}

	// Batch requests
	async batch(requests) {
		return measurePerformance('API:batch', () =>
			Promise.allSettled(
				requests.map(({ method, url, data, options }) =>
					this.request(method, url, data, options),
				),
			),
		);
	}

	// Health check
	async healthCheck() {
		try {
			const response = await this.get('/health', { cacheTTL: 30000 }); // Cache for 30 seconds
			return response.status === 'ok';
		} catch {
			return false;
		}
	}

	// Clear cache manually
	clearCache(pattern = null) {
		if (pattern) {
			const regex = new RegExp(pattern);
			for (const key of this.cache.keys()) {
				if (regex.test(key)) {
					this.cache.delete(key);
				}
			}
		} else {
			this.cache.clear();
		}
	}

	// Get cache stats
	getCacheStats() {
		return {
			size: this.cache.size,
			keys: Array.from(this.cache.keys()),
			pendingRequests: this.pendingRequests.size,
		};
	}

	// Domain-specific convenience methods (cocktails, favorites)
	async getCocktails(filters = {}) {
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([k, v]) => {
			if (v !== undefined && v !== null && v !== '') params.append(k, v);
		});
		return this.get(`/cocktails?${params.toString()}`);
	}

	async createCocktail(data) {
		return this.post('/cocktails', data);
	}

	async addFavorite(cocktailId) {
		return this.post(`/cocktails/${cocktailId}/favorite`);
	}

	async removeFavorite(cocktailId) {
		return this.delete(`/cocktails/${cocktailId}/favorite`);
	}
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

// Export specific methods for convenience
export const {
	get,
	post,
	put,
	patch,
	delete: del,
	uploadFile,
	batch,
	healthCheck,
	clearCache,
} = apiService;
