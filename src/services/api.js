// API service layer for backend communication
const API_BASE_URL =
	import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
	constructor() {
		this.baseURL = API_BASE_URL;
	}

	async request(endpoint, options = {}) {
		const url = `${this.baseURL}${endpoint}`;
		const token = localStorage.getItem('authToken');

		const config = {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			...options,
		};

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		try {
			const response = await fetch(url, config);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'API request failed');
			}

			return data;
		} catch (error) {
			console.error('API Error:', error);
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
		// Handle FormData for file uploads
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
