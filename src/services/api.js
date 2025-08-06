// API service layer for backend communication
import {
	SecureTokenManager,
	validateSecurityHeaders,
	ClientRateLimiter,
} from '../utils/security.js';

const API_BASE_URL =
	import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Client-side rate limiter
const rateLimiter = new ClientRateLimiter(50, 15 * 60 * 1000); // 50 requests per 15 minutes

class ApiService {
	constructor() {
		this.baseURL = API_BASE_URL;
		this.requestId = 0;
	}

	async request(endpoint, options = {}) {
		// Check client-side rate limiting
		if (!rateLimiter.isAllowed()) {
			throw new Error(
				'Too many requests. Please wait before trying again.',
			);
		}

		const url = `${this.baseURL}${endpoint}`;
		const token = SecureTokenManager.getToken();

		// Check token expiration
		if (token && SecureTokenManager.isTokenExpired(token)) {
			SecureTokenManager.removeToken();
			window.location.href = '/login';
			return;
		}

		const requestId = ++this.requestId;

		const config = {
			headers: {
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'X-Request-ID': requestId.toString(),
				...options.headers,
			},
			credentials: 'omit', // Don't send cookies
			...options,
		};

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		try {
			console.log(`🔐 API Request [${requestId}]:`, {
				method: config.method || 'GET',
				url,
				hasAuth: !!token,
			});

			const response = await fetch(url, config);

			// Validate security headers
			validateSecurityHeaders(response);

			const data = await response.json();

			if (!response.ok) {
				// Handle specific error cases
				if (response.status === 401) {
					SecureTokenManager.removeToken();
					throw new Error(
						'Authentication required. Please log in again.',
					);
				} else if (response.status === 403) {
					throw new Error(
						"Access denied. You don't have permission for this action.",
					);
				} else if (response.status === 429) {
					throw new Error(
						'Too many requests. Please wait before trying again.',
					);
				}

				throw new Error(
					data.message ||
						`Request failed with status ${response.status}`,
				);
			}

			console.log(`✅ API Response [${requestId}]:`, {
				status: response.status,
				hasData: !!data,
			});

			return data;
		} catch (error) {
			console.error(`❌ API Error [${requestId}]:`, error.message);

			// Handle network errors
			if (error instanceof TypeError && error.message.includes('fetch')) {
				throw new Error(
					'Network error. Please check your connection and try again.',
				);
			}

			throw error;
		}
	}

	// Auth methods
	async login(credentials) {
		return this.request('/auth/login', {
			method: 'POST',
			body: JSON.stringify(credentials),
		});
	}

	async register(userData) {
		return this.request('/auth/register', {
			method: 'POST',
			body: JSON.stringify(userData),
		});
	}

	async logout() {
		return this.request('/auth/logout', {
			method: 'POST',
		});
	}

	// Cocktail methods
	async getCocktails(filters = {}) {
		const params = new URLSearchParams(filters);
		return this.request(`/cocktails?${params}`);
	}

	async createCocktail(cocktailData) {
		// If image is a URL (from Cloudinary), send as JSON
		if (cocktailData.image && typeof cocktailData.image === 'string') {
			return this.request('/cocktails', {
				method: 'POST',
				body: JSON.stringify(cocktailData),
			});
		}

		// Handle FormData for file uploads (fallback for direct file uploads)
		const formData = new FormData();
		Object.keys(cocktailData).forEach((key) => {
			if (key === 'ingredients' || key === 'instructions') {
				formData.append(key, JSON.stringify(cocktailData[key]));
			} else {
				formData.append(key, cocktailData[key]);
			}
		});

		return this.request('/cocktails', {
			method: 'POST',
			headers: {}, // Remove Content-Type to let browser set boundary for FormData
			body: formData,
		});
	}

	async getCocktailById(id) {
		return this.request(`/cocktails/${id}`);
	}

	async updateCocktail(id, cocktailData) {
		return this.request(`/cocktails/${id}`, {
			method: 'PUT',
			body: JSON.stringify(cocktailData),
		});
	}

	async deleteCocktail(id) {
		return this.request(`/cocktails/${id}`, {
			method: 'DELETE',
		});
	}

	// User methods
	async getProfile() {
		return this.request('/users/profile');
	}

	async updateProfile(userData) {
		return this.request('/users/profile', {
			method: 'PUT',
			body: JSON.stringify(userData),
		});
	}

	async getCommunityMembers(filters = {}) {
		const params = new URLSearchParams(filters);
		return this.request(`/users?${params}`);
	}

	async getUserStats(userId) {
		return this.request(`/users/${userId}/stats`);
	}

	async followUser(userId) {
		return this.request(`/users/${userId}/follow`, {
			method: 'POST',
		});
	}

	async unfollowUser(userId) {
		return this.request(`/users/${userId}/unfollow`, {
			method: 'DELETE',
		});
	}
}

export default new ApiService();
