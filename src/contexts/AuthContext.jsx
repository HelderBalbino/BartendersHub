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
			const raw = await apiService.post('/auth/login', {
				email,
				password,
			});
			// raw may already be the payload (apiService returns response.data) per apiService implementation
			// Supported shapes:
			// 1) { success:true, token, user, needsVerification }
			// 2) { success:true, data:{ token, user, needsVerification }, meta:{ message } }
			// 3) Legacy: { token, user }
			let success = raw?.success;
			let token = raw?.token;
			let user = raw?.user;
			let needsVerification = raw?.needsVerification;
			if (success && raw?.data) {
				// New envelope style
				token = raw.data.token;
				user = raw.data.user;
				needsVerification =
					raw.data.needsVerification ?? needsVerification;
			}
			if (!token || !user) {
				throw new Error('Login failed');
			}
			// Store token
			TokenManager.set(token, remember);
			dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
			try {
				localStorage.setItem(
					'currentUserId',
					user.id || user._id || user.userId || '',
				);
			} catch {
				/* ignore */
			}
			return { success: true, user, needsVerification };
		} catch (error) {
			let errorMessage = 'Login failed';
			let needVerification = false;
			const status = error.response?.status || error.status;
			if (error.response?.data) {
				const d = error.response.data;
				// Support new envelope { success:false, error:{ message }}
				if (d.error?.message) errorMessage = d.error.message;
				else if (d.message) errorMessage = d.message;
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
			const raw = await apiService.post('/auth/register', userData);
			let success = raw?.success;
			let token = raw?.token;
			let user = raw?.user;
			if (success && raw?.data) {
				token = raw.data.token;
				user = raw.data.user;
			}
			if (!success || !token || !user)
				throw new Error(raw?.message || 'Registration failed');
			TokenManager.set(token, false);
			dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
			try {
				localStorage.setItem(
					'currentUserId',
					user.id || user._id || user.userId || '',
				);
			} catch {
				/* ignore */
			}
			return { success: true, user };
		} catch (error) {
			// Derive message from various error shapes produced by apiService/enhanceError
			const d = error?.response?.data || error?.data || {};
			const errorMessage =
				d.error?.message ||
				d.message ||
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
