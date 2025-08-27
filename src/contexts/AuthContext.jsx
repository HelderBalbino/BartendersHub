import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContextDefinition';
import { logError } from '../utils/errorMonitoring';
import apiService from '../services/api';

// Enhanced auth reducer with better state management
const authReducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN_START':
			return { ...state, loading: true, error: null };

		case 'LOGIN_SUCCESS':
			return {
				...state,
				loading: false,
				isAuthenticated: true,
				user: action.payload.user,
				token: action.payload.token,
				error: null,
				lastLogin: new Date().toISOString(),
			};

		case 'LOGIN_FAILURE':
			return {
				...state,
				loading: false,
				isAuthenticated: false,
				user: null,
				token: null,
				error: action.payload,
			};

		case 'LOGOUT':
			return {
				...state,
				isAuthenticated: false,
				user: null,
				token: null,
				error: null,
				lastLogin: null,
			};

		case 'UPDATE_USER':
			return {
				...state,
				user: { ...state.user, ...action.payload },
			};

		case 'CLEAR_ERROR':
			return { ...state, error: null };

		case 'SET_LOADING':
			return { ...state, loading: action.payload };

		default:
			return state;
	}
};

// Initial state
const initialState = {
	isAuthenticated: false,
	user: null,
	token: null,
	loading: true, // Start with true so we show loading while checking auth
	error: null,
	lastLogin: null,
};

// Enhanced token management utility
class TokenManager {
	static get() {
		try {
			return (
				localStorage.getItem('token') || sessionStorage.getItem('token')
			);
		} catch {
			return null;
		}
	}

	static set(token, remember = false) {
		try {
			if (remember) {
				localStorage.setItem('token', token);
				sessionStorage.removeItem('token');
			} else {
				sessionStorage.setItem('token', token);
				localStorage.removeItem('token');
			}
		} catch (error) {
			logError(error, 'token-storage');
		}
	}

	static remove() {
		try {
			localStorage.removeItem('token');
			sessionStorage.removeItem('token');
		} catch (error) {
			logError(error, 'token-removal');
		}
	}

	static isExpired(token) {
		if (!token) return true;

		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.exp * 1000 < Date.now();
		} catch {
			return true;
		}
	}
}

export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	// Memoized login function
	const login = useCallback(async (email, password, remember = false) => {
		dispatch({ type: 'LOGIN_START' });

		try {
			const response = await apiService.post('/auth/login', {
				email,
				password,
			});

			// Handle different response structures
			// Sometimes the response is the data itself, sometimes it's nested under .data
			let responseData;
			if (response.data) {
				// Standard axios response structure
				responseData = response.data;
			} else if (response.success !== undefined) {
				// Response is the data itself
				responseData = response;
			} else {
				throw new Error('No valid response data found');
			}

			// The API returns: { success: true, message: "...", token: "...", user: {...} }
			if (!responseData) {
				throw new Error('No response data received');
			}

			// Check if the response indicates success
			if (!responseData.success) {
				throw new Error(responseData.message || 'Login failed');
			}

			if (!responseData.token) {
				throw new Error('No token in response');
			}

			if (!responseData.user) {
				throw new Error('No user in response');
			}

			const { token, user } = responseData;

			// Store token with preference
			TokenManager.set(token, remember);

			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { token, user },
			});

			// Persist current user id for optimistic UI helpers
			try {
				localStorage.setItem(
					'currentUserId',
					user.id || user._id || user.userId || '',
				);
			} catch {
				// ignore storage errors
			}

			return { success: true, user };
		} catch (error) {
			let errorMessage = 'Login failed';
			let needVerification = false;
			const status = error.response?.status || error.status;
			if (error.response?.data) {
				if (error.response.data.message)
					errorMessage = error.response.data.message;
				if (error.response.data.needVerification)
					needVerification = true;
			} else if (error.message) {
				errorMessage = error.message;
			}
			dispatch({
				type: 'LOGIN_FAILURE',
				payload: errorMessage,
			});
			// Suppress noisy logging for expected unverified email case
			if (!(status === 403 && needVerification)) {
				logError(error, 'auth-login');
			}
			return {
				success: false,
				error: errorMessage,
				needVerification,
			};
		}
	}, []);

	// Memoized register function
	const register = useCallback(async (userData) => {
		dispatch({ type: 'LOGIN_START' });

		try {
			const response = await apiService.post('/auth/register', userData);
			// Normalize potential response shapes
			const data =
				response?.data?.success !== undefined
					? response.data
					: response;
			if (!data?.success) {
				throw new Error(data?.message || 'Registration failed');
			}
			if (!data.token || !data.user) {
				throw new Error('Incomplete registration response');
			}
			TokenManager.set(data.token, false);
			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { token: data.token, user: data.user },
			});
			try {
				localStorage.setItem(
					'currentUserId',
					data.user.id || data.user._id || data.user.userId || '',
				);
			} catch {
				// ignore storage errors
			}
			return { success: true, user: data.user };
		} catch (error) {
			// Derive message from various error shapes produced by apiService/enhanceError
			const errorMessage =
				error?.response?.data?.message ||
				error?.data?.message ||
				error?.message ||
				'Registration failed';
			dispatch({
				type: 'LOGIN_FAILURE',
				payload: errorMessage,
			});

			logError(error, 'auth-register');
			return { success: false, error: errorMessage };
		}
	}, []);

	// Memoized logout function
	const logout = useCallback(async () => {
		try {
			// Optional: notify server of logout
			await apiService.post('/auth/logout').catch(() => {
				// Ignore server errors during logout
			});
		} finally {
			TokenManager.remove();
			apiService.clearCache(); // Clear API cache on logout
			dispatch({ type: 'LOGOUT' });
		}
	}, []);

	// Memoized user update function
	const updateUser = useCallback(async (userData) => {
		try {
			const response = await apiService.put('/auth/profile', userData);
			const updatedUser = response.data.user;

			dispatch({
				type: 'UPDATE_USER',
				payload: updatedUser,
			});

			return { success: true, user: updatedUser };
		} catch (error) {
			const errorMessage = error.data?.message || 'Update failed';
			logError(error, 'auth-update');
			return { success: false, error: errorMessage };
		}
	}, []);

	// Memoized error clearing function
	const clearError = useCallback(() => {
		dispatch({ type: 'CLEAR_ERROR' });
	}, []);

	// Check authentication status on mount and token changes
	const checkAuthStatus = useCallback(async () => {
		const token = TokenManager.get();

		if (!token || TokenManager.isExpired(token)) {
			TokenManager.remove();
			dispatch({ type: 'LOGOUT' });
			dispatch({ type: 'SET_LOADING', payload: false });
			return;
		}

		try {
			dispatch({ type: 'SET_LOADING', payload: true });
			const response = await apiService.get('/auth/me', {
				cache: true,
				cacheTTL: 60000,
			});

			// Handle different response structures safely
			let user;
			if (response.data?.user) {
				user = response.data.user;
			} else if (response.data) {
				// Fallback if response.data is the user object itself
				user = response.data;
			} else if (response.user) {
				// Another possible structure
				user = response.user;
			} else {
				throw new Error('No user data found in response');
			}

			if (!user) {
				throw new Error('User data is null or undefined');
			}

			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { token, user },
			});
			try {
				localStorage.setItem(
					'currentUserId',
					user.id || user._id || user.userId || '',
				);
			} catch {
				// ignore storage errors
			}
		} catch (error) {
			console.error('Auth check error:', error);
			// If the token is invalid or expired, logout
			TokenManager.remove();
			dispatch({ type: 'LOGOUT' });
			logError(error, 'auth-check');
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false });
		}
	}, []);

	// Initialize auth state
	useEffect(() => {
		checkAuthStatus();
	}, [checkAuthStatus]);

	// Auto-refresh token before expiration
	useEffect(() => {
		if (!state.token) return;

		const refreshInterval = setInterval(() => {
			if (TokenManager.isExpired(state.token)) {
				logout();
			}
		}, 60000); // Check every minute

		return () => clearInterval(refreshInterval);
	}, [state.token, logout]);

	// Memoized context value
	const contextValue = useMemo(
		() => ({
			...state,
			login,
			register,
			logout,
			updateUser,
			clearError,
			checkAuthStatus,
		}),
		[
			state,
			login,
			register,
			logout,
			updateUser,
			clearError,
			checkAuthStatus,
		],
	);

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
