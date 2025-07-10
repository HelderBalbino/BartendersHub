import { useState } from 'react';

export const useFormValidation = (initialValues, validationRules) => {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const validateField = (name, value) => {
		const rules = validationRules[name];
		if (!rules) return '';

		for (const rule of rules) {
			const error = rule(value, values);
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
		const newValue = type === 'file' ? files[0] : value;

		setValues((prev) => ({
			...prev,
			[name]: newValue,
		}));

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
		const { name } = e.target;
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
		if (value && value.length < 6) {
			return 'Password must be at least 6 characters long';
		}
		return '';
	},

	passwordStrong: (value) => {
		const strongPasswordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
		if (value && !strongPasswordRegex.test(value)) {
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
