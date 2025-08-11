import { useState } from 'react';

const PasswordInput = ({
	name,
	value,
	onChange,
	onBlur,
	placeholder,
	required = false,
	error,
	touched,
	label,
	className = '',
	autocomplete = 'current-password',
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div>
			{label && (
				<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-2'>
					{label}
				</label>
			)}
			<div className='relative'>
				<input
					type={showPassword ? 'text' : 'password'}
					name={name}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					autoComplete={autocomplete}
					className={`w-full bg-black/20 border ${
						touched && error
							? 'border-red-400'
							: 'border-yellow-400/30'
					} text-white caret-white px-4 py-3 pr-12 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-400 font-normal ${className}`}
					style={{
						color: '#ffffff',
						backgroundColor: 'rgba(0, 0, 0, 0.2)',
					}}
					placeholder={placeholder}
					required={required}
					{...props}
				/>
				<button
					type='button'
					onClick={togglePasswordVisibility}
					className='absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400/70 hover:text-yellow-400 transition-all duration-200 focus:outline-none focus:text-yellow-400 focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-black/20 rounded p-1'
					aria-label={
						showPassword ? 'Hide password' : 'Show password'
					}
					tabIndex={0}
				>
					{showPassword ? (
						// Eye slash icon (hide password)
						<svg
							className='w-5 h-5 transition-transform duration-200 hover:scale-110'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1.5}
								d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
							/>
						</svg>
					) : (
						// Eye icon (show password)
						<svg
							className='w-5 h-5 transition-transform duration-200 hover:scale-110'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1.5}
								d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
							/>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1.5}
								d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
							/>
						</svg>
					)}
				</button>
			</div>
			{touched && error && (
				<p className='mt-1 text-red-400 text-xs'>{error}</p>
			)}
		</div>
	);
};

export default PasswordInput;
