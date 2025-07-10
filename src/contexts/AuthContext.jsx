import { createContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';

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
	token: localStorage.getItem('authToken'),
	loading: false,
	error: null,
};

export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	// Check if user is logged in on app start
	useEffect(() => {
		const token = localStorage.getItem('authToken');
		if (token) {
			// Verify token validity and get user data
			apiService
				.getProfile()
				.then((data) => {
					dispatch({
						type: 'LOGIN_SUCCESS',
						payload: { user: data.user, token },
					});
				})
				.catch(() => {
					localStorage.removeItem('authToken');
					dispatch({ type: 'LOGOUT' });
				});
		}
	}, []);

	const login = async (credentials) => {
		dispatch({ type: 'LOGIN_START' });
		try {
			const data = await apiService.login(credentials);
			localStorage.setItem('authToken', data.token);
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
			localStorage.setItem('authToken', data.token);
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
		localStorage.removeItem('authToken');
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
