import {
	createContext,
	useReducer,
	useEffect,
	useCallback,
	useMemo,
} from 'react';
import { logError } from '../utils/errorMonitoring';
import apiService from '../services/optimizedApi';

// Enhanced Auth Context with better performance and security
export const AuthContext = createContext();

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
	loading: true,
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

			const { token, user } = response.data;

			// Store token with preference
			TokenManager.set(token, remember);

			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { token, user },
			});

			return { success: true, user };
		} catch (error) {
			const errorMessage = error.data?.message || 'Login failed';
			dispatch({
				type: 'LOGIN_FAILURE',
				payload: errorMessage,
			});

			logError(error, 'auth-login');
			return { success: false, error: errorMessage };
		}
	}, []);

	// Memoized register function
	const register = useCallback(async (userData) => {
		dispatch({ type: 'LOGIN_START' });

		try {
			const response = await apiService.post('/auth/register', userData);
			const { token, user } = response.data;

			TokenManager.set(token, false); // Default to session storage for new users

			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { token, user },
			});

			return { success: true, user };
		} catch (error) {
			const errorMessage = error.data?.message || 'Registration failed';
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
			return;
		}

		try {
			dispatch({ type: 'SET_LOADING', payload: true });
			const response = await apiService.get('/auth/me', {
				cache: true,
				cacheTTL: 60000,
			});
			const user = response.data.user;

			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { token, user },
			});
		} catch (error) {
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
