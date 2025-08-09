import { createContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';
import { SecureTokenManager } from '../utils/security';

// Auth Context
export const AuthContext = createContext();

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
			};
		case 'UPDATE_USER':
			return {
				...state,
				user: { ...state.user, ...action.payload },
			};
		case 'CLEAR_ERROR':
			return { ...state, error: null };
		default:
			return state;
	}
};

const initialState = {
	isAuthenticated: false,
	user: null,
	token: SecureTokenManager.getToken(),
	loading: false,
	error: null,
};

export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	// Check if user is logged in on app start
	useEffect(() => {
		// Small delay to ensure localStorage is fully available
		const checkAuth = () => {
			const token = SecureTokenManager.getToken();
			console.log('🔐 AuthContext: Checking stored token on app start', {
				hasToken: !!token,
			});

			if (token && !SecureTokenManager.isTokenExpired(token)) {
				console.log(
					'🔐 AuthContext: Valid token found, verifying with server...',
				);
				// Verify token validity and get user data
				apiService
					.getProfile()
					.then((data) => {
						console.log(
							'🔐 AuthContext: Profile verified, user logged in',
							data.user,
						);
						dispatch({
							type: 'LOGIN_SUCCESS',
							payload: { user: data.user, token },
						});
					})
					.catch((error) => {
						console.log(
							'🔐 AuthContext: Profile verification failed, logging out',
							error.message,
						);
						SecureTokenManager.removeToken();
						dispatch({ type: 'LOGOUT' });
					});
			} else if (token && SecureTokenManager.isTokenExpired(token)) {
				console.log('🔐 AuthContext: Expired token found, removing...');
				// Remove expired token
				SecureTokenManager.removeToken();
				dispatch({ type: 'LOGOUT' });
			} else {
				console.log(
					'🔐 AuthContext: No token found, user not logged in',
				);
			}
		};

		// Small delay to ensure the component is fully mounted
		setTimeout(checkAuth, 100);
	}, []);

	const login = async (credentials) => {
		dispatch({ type: 'LOGIN_START' });
		try {
			const data = await apiService.login(credentials);
			SecureTokenManager.setToken(data.token);
			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { user: data.user, token: data.token },
			});
			return data;
		} catch (error) {
			dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
			throw error;
		}
	};

	const register = async (userData) => {
		dispatch({ type: 'LOGIN_START' });
		try {
			const data = await apiService.register(userData);
			SecureTokenManager.setToken(data.token);
			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { user: data.user, token: data.token },
			});
			return data;
		} catch (error) {
			dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
			throw error;
		}
	};

	const logout = () => {
		SecureTokenManager.removeToken();
		dispatch({ type: 'LOGOUT' });
	};

	const updateUser = (userData) => {
		dispatch({ type: 'UPDATE_USER', payload: userData });
	};

	const clearError = () => {
		dispatch({ type: 'CLEAR_ERROR' });
	};

	const value = {
		...state,
		login,
		register,
		logout,
		updateUser,
		clearError,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
