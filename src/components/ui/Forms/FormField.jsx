import PropTypes from 'prop-types';

const FormField = ({
	label,
	name,
	type = 'text',
	value,
	onChange,
	onBlur,
	placeholder,
	required = false,
	error,
	touched,
	className = '',
	children,
	...props
}) => {
	const hasError = touched && error;

	const inputClasses = `w-full bg-transparent border ${
		hasError ? 'border-red-400' : 'border-yellow-400/30'
	} text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500`;

	const renderInput = () => {
		if (type === 'textarea') {
			return (
				<textarea
					name={name}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					placeholder={placeholder}
					className={`${inputClasses} resize-none`}
					{...props}
				/>
			);
		}

		if (type === 'select') {
			return (
				<select
					name={name}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					className={`${inputClasses.replace(
						'bg-transparent',
						'bg-black',
					)}`}
					{...props}
				>
					{children}
				</select>
			);
		}

		return (
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				className={inputClasses}
				{...props}
			/>
		);
	};

	return (
		<div className={className}>
			{label && (
				<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
					{label} {required && '*'}
				</label>
			)}

			{renderInput()}

			{hasError && <p className='mt-1 text-red-400 text-xs'>{error}</p>}
		</div>
	);
};

FormField.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
	type: PropTypes.oneOf([
		'text',
		'email',
		'password',
		'number',
		'textarea',
		'select',
	]),
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func,
	placeholder: PropTypes.string,
	required: PropTypes.bool,
	error: PropTypes.string,
	touched: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.node,
};

export default FormField;
