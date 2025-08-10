import { useState } from 'react';
import { sanitizeUserInput } from '../utils/security';

export const useFormValidation = (initialValues, validationRules) => {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const validateField = (name, value) => {
		const rules = validationRules[name];
		if (!rules) return '';

		// Sanitize input before validation
		const sanitizedValue = sanitizeUserInput(value, {
			maxLength: 1000, // Prevent extremely long inputs
			trimWhitespace: true,
		});

		for (const rule of rules) {
			const error = rule(sanitizedValue, values);
			if (error) return error;
		}
		return '';
	};

	const validateAll = () => {
		const newErrors = {};
		Object.keys(validationRules).forEach((field) => {
			const error = validateField(field, values[field]);
			if (error) newErrors[field] = error;
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		const { name, value, type, files } = e.target;
		let newValue = type === 'file' ? files[0] : value;

		// Only apply basic length limits during typing, not full sanitization
		// Full sanitization will happen on blur/submit
		if (
			type === 'text' ||
			type === 'email' ||
			type === 'password' ||
			type === 'textarea'
		) {
			// Only enforce max length during typing to prevent extremely long inputs
			const maxLength =
				name === 'bio' ? 500 : name === 'description' ? 1000 : 200;
			if (newValue && newValue.length > maxLength) {
				newValue = newValue.substring(0, maxLength);
			}
		}

		console.log('🔧 useFormValidation.handleChange called:', {
			name,
			value,
			newValue,
			currentValues: values,
		});

		setValues((prev) => {
			const newState = {
				...prev,
				[name]: newValue,
			};
			console.log('🔧 setValues called with:', newState);
			return newState;
		});

		// Validate field if it has been touched
		if (touched[name]) {
			const error = validateField(name, newValue);
			setErrors((prev) => ({
				...prev,
				[name]: error,
			}));
		}
	};

	const handleBlur = (e) => {
		const { name, type } = e.target;

		// Apply full sanitization on blur for text inputs
		if (
			type === 'text' ||
			type === 'email' ||
			type === 'password' ||
			type === 'textarea'
		) {
			const currentValue = values[name];
			const sanitizedValue = sanitizeUserInput(currentValue, {
				maxLength:
					name === 'bio' ? 500 : name === 'description' ? 1000 : 200,
				trimWhitespace: name !== 'password', // Don't trim passwords
			});

			// Update value with sanitized version if it changed
			if (sanitizedValue !== currentValue) {
				setValues((prev) => ({
					...prev,
					[name]: sanitizedValue,
				}));
			}
		}

		setTouched((prev) => ({
			...prev,
			[name]: true,
		}));

		const error = validateField(name, values[name]);
		setErrors((prev) => ({
			...prev,
			[name]: error,
		}));
	};

	const reset = () => {
		setValues(initialValues);
		setErrors({});
		setTouched({});
	};

	return {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		validateAll,
		reset,
		setValues,
	};
};

// Common validation rules
export const validationRules = {
	required: (value) => {
		if (!value || (typeof value === 'string' && !value.trim())) {
			return 'This field is required';
		}
		return '';
	},

	email: (value) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (value && !emailRegex.test(value)) {
			return 'Please enter a valid email address';
		}
		return '';
	},

	password: (value) => {
		if (value && value.length < 8) {
			return 'Password must be at least 8 characters long';
		}
		return '';
	},

	passwordStrong: (value) => {
		if (!value) return '';

		if (value.length < 8) {
			return 'Password must be at least 8 characters long';
		}

		const strongPasswordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
		if (!strongPasswordRegex.test(value)) {
			return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
		}
		return '';
	},

	confirmPassword: (value, allValues) => {
		if (value && value !== allValues.password) {
			return 'Passwords do not match';
		}
		return '';
	},

	minLength: (min) => (value) => {
		if (value && value.length < min) {
			return `Must be at least ${min} characters long`;
		}
		return '';
	},

	maxLength: (max) => (value) => {
		if (value && value.length > max) {
			return `Must be no more than ${max} characters long`;
		}
		return '';
	},

	arrayMinLength: (min) => (value) => {
		if (
			Array.isArray(value) &&
			value.filter((item) => item.trim()).length < min
		) {
			return `Must have at least ${min} items`;
		}
		return '';
	},
};
