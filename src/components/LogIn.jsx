import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import CountrySelect from './ui/Forms/CountrySelect';
import { validationRules } from '../hooks/useFormValidation';
import FullScreenSpinner from './FullScreenSpinner';
import GradientPage from './GradientPage';
import PasswordInput from './ui/Forms/PasswordInput';

const LogIn = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const mode = searchParams.get('mode');
	const redirectPath = searchParams.get('redirect') || '/';
	const [isLogin, setIsLogin] = useState(
		mode === 'login' || mode !== 'register',
	);

	const { login, register, loading, error, isAuthenticated, clearError } =
		useAuth();
	const [needVerification, setNeedVerification] = useState(false);
	const [resent, setResent] = useState(false);
	const [cooldown, setCooldown] = useState(0); // seconds remaining for resend

	// Cooldown timer effect
	useEffect(() => {
		if (cooldown <= 0) return;
		const id = setInterval(() => {
			setCooldown((c) => (c > 1 ? c - 1 : 0));
		}, 1000);
		return () => clearInterval(id);
	}, [cooldown]);

	// FIXED: Replace useFormValidation with simple local state
	const [formValues, setFormValues] = useState({
		email: '',
		password: '',
		name: '',
		username: '',
		confirmPassword: '',
		country: '',
	});

	const [formErrors, setFormErrors] = useState({});
	const [formTouched, setFormTouched] = useState({});

	// Validation rules
	const loginValidation = {
		email: [validationRules.required, validationRules.email],
		password: [validationRules.required],
	};

	const registerValidation = {
		name: [validationRules.required, validationRules.minLength(2)],
		username: [validationRules.required, validationRules.minLength(3)],
		email: [validationRules.required, validationRules.email],
		password: [validationRules.required, validationRules.passwordStrong],
		confirmPassword: [
			validationRules.required,
			validationRules.confirmPassword,
		],
		country: [validationRules.required, validationRules.minLength(2)],
	};

	// Simple form handlers
	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear error when user starts typing
		if (formErrors[name]) {
			setFormErrors((prev) => ({
				...prev,
				[name]: '',
			}));
		}
	};

	const handleFormBlur = (e) => {
		const { name } = e.target;
		setFormTouched((prev) => ({
			...prev,
			[name]: true,
		}));

		// Validate field on blur using microtask
		queueMicrotask(() => {
			validateField(name, formValues[name]);
		});
	};

	const validateField = (name, value) => {
		const rules = (isLogin ? loginValidation : registerValidation)[name];
		if (!rules) return '';

		for (const rule of rules) {
			const error = rule(value, formValues);
			if (error) {
				setFormErrors((prev) => ({
					...prev,
					[name]: error,
				}));
				return error;
			}
		}

		setFormErrors((prev) => ({
			...prev,
			[name]: '',
		}));
		return '';
	};

	const validateAllFields = () => {
		const currentValidation = isLogin
			? loginValidation
			: registerValidation;
		const newErrors = {};

		Object.keys(currentValidation).forEach((field) => {
			const rules = currentValidation[field];
			if (rules) {
				for (const rule of rules) {
					const error = rule(formValues[field], formValues);
					if (error) {
						newErrors[field] = error;
						break;
					}
				}
			}
		});

		setFormErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate(redirectPath, { replace: true });
		}
	}, [isAuthenticated, navigate, redirectPath]);

	// Update login state when URL changes
	useEffect(() => {
		if (mode === 'login') {
			setIsLogin(true);
		} else if (mode === 'register') {
			setIsLogin(false);
		}
	}, [mode]);

	// Clear errors when switching modes
	useEffect(() => {
		// Clear form state when switching between login/register
		setFormValues({
			email: '',
			password: '',
			name: '',
			username: '',
			confirmPassword: '',
			country: '',
		});
		setFormErrors({});
		setFormTouched({});

		// Clear auth errors (call function directly without dependency)
		clearError();
	}, [isLogin]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateAllFields()) {
			toast.error('Please fix the errors in the form');
			return;
		}

		try {
			if (isLogin) {
				const result = await login(
					formValues.email,
					formValues.password,
					false, // remember me option - you can add this later
				);

				if (result.success) {
					toast.success('Welcome back to the speakeasy!');
					if (result.needsVerification) {
						setNeedVerification(true); // show inline banner/message
						toast(
							'Verify your email when convenient for full access',
							{
								icon: '✉️',
							},
						);
					}
				} else {
					if (result.needVerification) {
						setNeedVerification(true);
						toast('Email verification recommended', { icon: '✉️' });
					} else {
						toast.error(result.error || 'Login failed');
					}
				}
			} else {
				const result = await register({
					name: formValues.name,
					username: formValues.username,
					email: formValues.email,
					password: formValues.password,
					country: formValues.country,
				});

				if (result.success) {
					toast.success('Welcome to BartendersHub!');
				} else {
					toast.error(result.error || 'Registration failed');
				}
			}
		} catch (error) {
			console.error('Authentication error:', error);
			toast.error('An unexpected error occurred');
		}
	};

	const handleResendVerification = async () => {
		if (!formValues.email) {
			toast.error('Enter your email first');
			return;
		}
		try {
			const res = await apiService.post('/auth/resend-verification', {
				email: formValues.email,
			});
			setResent(true);
			setCooldown(60); // start cooldown locally to match server
			toast.success(
				res?.data?.message || 'Verification email sent successfully',
			);
		} catch (e) {
			const status = e?.response?.status;
			if (status === 429) {
				const retry = e?.response?.data?.retryAfterSeconds || 60;
				setCooldown(retry);
				toast.error(
					e?.response?.data?.message ||
						'Please wait before requesting another email',
				);
			} else {
				toast.error(
					e?.response?.data?.message ||
						'Failed to resend verification email',
				);
			}
		}
	};

	if (loading)
		return (
			<FullScreenSpinner
				size='large'
				text={
					isLogin
						? 'Entering the speakeasy...'
						: 'Joining the elite...'
				}
			/>
		);

	return (
		<GradientPage full center className='overflow-hidden py-8'>
			{/* Art Deco Background Pattern */}
			<div className='absolute inset-0 opacity-8'>
				{/* Golden gradient overlay */}
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/15 via-transparent to-yellow-400/5'></div>

				{/* Geometric Art Deco elements */}
				<div className='absolute top-8 left-8 md:top-16 md:left-16 w-32 md:w-48 h-32 md:h-48 border border-yellow-400/25 rotate-45'></div>
				<div className='absolute bottom-8 right-8 md:bottom-16 md:right-16 w-24 md:w-40 h-24 md:h-40 border border-yellow-400/25 rotate-45'></div>
				<div className='absolute top-1/2 left-8 w-20 md:w-32 h-20 md:h-32 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/4 right-8 w-24 md:w-36 h-24 md:h-36 border border-yellow-400/20 rotate-45'></div>

				{/* Central decorative line */}
				<div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-yellow-400/20 via-yellow-400/5 to-yellow-400/20'></div>
			</div>

			{/* Main Content */}
			<div className='relative z-10 w-full max-w-md mx-auto px-4'>
				{/* Header Section */}
				<div className='text-center mb-8'>
					<div className='flex items-center justify-center mb-6'>
						<div className='text-6xl md:text-7xl text-yellow-400 mb-3 filter drop-shadow-lg'>
							🥃
						</div>
					</div>

					<h1 className='text-2xl md:text-3xl font-light text-white mb-2 tracking-[0.2em] uppercase'>
						{isLogin ? 'Welcome Back' : 'Join the Hub'}
					</h1>
					<div className='w-20 h-0.5 bg-yellow-400 mx-auto mb-4'></div>
					<p className='text-gray-400 text-sm font-light italic'>
						{isLogin
							? 'Step back into the speakeasy'
							: 'Begin your mixology journey'}
					</p>
				</div>

				{/* Login/Register Form */}
				<div className='relative border border-yellow-400/40 p-6 md:p-8 bg-black/20 backdrop-blur-sm'>
					{/* Art Deco corner decorations */}
					<div className='absolute -top-1 -left-1 w-6 md:w-8 h-6 md:h-8 border-l-2 border-t-2 border-yellow-400'></div>
					<div className='absolute -top-1 -right-1 w-6 md:w-8 h-6 md:h-8 border-r-2 border-t-2 border-yellow-400'></div>
					<div className='absolute -bottom-1 -left-1 w-6 md:w-8 h-6 md:h-8 border-l-2 border-b-2 border-yellow-400'></div>
					<div className='absolute -bottom-1 -right-1 w-6 md:w-8 h-6 md:h-8 border-r-2 border-b-2 border-yellow-400'></div>

					{/* Toggle Buttons */}
					<div className='flex mb-6 border border-yellow-400/30 rounded-none overflow-hidden'>
						<button
							type='button'
							onClick={() => setIsLogin(true)}
							className={`flex-1 py-3 px-4 text-sm font-light tracking-wide uppercase transition-all duration-300 ${
								isLogin
									? 'bg-yellow-400 text-black'
									: 'bg-transparent text-yellow-400 hover:bg-yellow-400/10'
							}`}
						>
							Login
						</button>
						<button
							type='button'
							onClick={() => setIsLogin(false)}
							className={`flex-1 py-3 px-4 text-sm font-light tracking-wide uppercase transition-all duration-300 ${
								!isLogin
									? 'bg-yellow-400 text-black'
									: 'bg-transparent text-yellow-400 hover:bg-yellow-400/10'
							}`}
						>
							Register
						</button>
					</div>

					{/* Error & Verification Display */}
					{(error || needVerification) && (
						<div className='mb-6 p-4 border border-red-400/50 bg-red-900/20 text-red-400 text-sm space-y-2'>
							<p>
								{needVerification
									? 'Email not verified. Please verify your email to continue.'
									: error}
							</p>
							{needVerification && (
								<div className='flex flex-col sm:flex-row gap-2 sm:items-center'>
									<button
										onClick={handleResendVerification}
										disabled={cooldown > 0}
										className='text-yellow-400 hover:text-yellow-300 underline text-xs disabled:opacity-50 disabled:cursor-not-allowed'
									>
										{cooldown > 0
											? `Resend available in ${cooldown}s`
											: resent
											? 'Verification email sent'
											: 'Resend verification email'}
									</button>
									{resent && cooldown === 0 && (
										<span className='text-xs text-yellow-400'>
											Need another? You can resend again
											now.
										</span>
									)}
								</div>
							)}
						</div>
					)}

					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Name field (only for register) */}
						{!isLogin && (
							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-2'>
									Full Name
								</label>
								<input
									type='text'
									name='name'
									value={formValues.name}
									onChange={handleFormChange}
									onBlur={handleFormBlur}
									autoComplete='name'
									className={`w-full bg-black/20 border ${
										formTouched.name && formErrors.name
											? 'border-red-400'
											: 'border-yellow-400/30'
									} text-white caret-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-400 font-normal`}
									style={{
										color: '#ffffff',
										backgroundColor: 'rgba(0, 0, 0, 0.2)',
									}}
									placeholder='Enter your full name'
									required={!isLogin}
								/>
								{formTouched.name && formErrors.name && (
									<p className='mt-1 text-red-400 text-xs'>
										{formErrors.name}
									</p>
								)}
							</div>
						)}

						{/* Username field (only for register) */}
						{!isLogin && (
							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-2'>
									Username
								</label>
								<input
									type='text'
									name='username'
									value={formValues.username}
									onChange={handleFormChange}
									onBlur={handleFormBlur}
									autoComplete='username'
									className={`w-full bg-black/20 border ${
										formTouched.username &&
										formErrors.username
											? 'border-red-400'
											: 'border-yellow-400/30'
									} text-white caret-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-400 font-normal`}
									style={{
										color: '#ffffff',
										backgroundColor: 'rgba(0, 0, 0, 0.2)',
									}}
									placeholder='Enter your username'
									required={!isLogin}
								/>
								{formTouched.username &&
									formErrors.username && (
										<p className='mt-1 text-red-400 text-xs'>
											{formErrors.username}
										</p>
									)}
							</div>
						)}

						{/* Email field */}
						<div>
							<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-2'>
								Email Address
							</label>
							<input
								type='email'
								name='email'
								value={formValues.email}
								onChange={handleFormChange}
								onBlur={handleFormBlur}
								autoComplete='email'
								className={`w-full bg-black/20 border ${
									formTouched.email && formErrors.email
										? 'border-red-400'
										: 'border-yellow-400/30'
								} text-white caret-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-400 font-normal`}
								style={{
									color: '#ffffff',
									backgroundColor: 'rgba(0, 0, 0, 0.2)',
								}}
								placeholder='Enter your email'
								required
							/>
							{formTouched.email && formErrors.email && (
								<p className='mt-1 text-red-400 text-xs'>
									{formErrors.email}
								</p>
							)}
						</div>

						{/* Password field */}
						<PasswordInput
							name='password'
							value={formValues.password}
							onChange={handleFormChange}
							onBlur={handleFormBlur}
							label='Password'
							placeholder='Enter your password'
							required
							error={formErrors.password}
							touched={formTouched.password}
							autocomplete={
								isLogin ? 'current-password' : 'new-password'
							}
						/>

						{/* Confirm Password field (only for register) */}
						{!isLogin && (
							<PasswordInput
								name='confirmPassword'
								value={formValues.confirmPassword}
								onChange={handleFormChange}
								onBlur={handleFormBlur}
								label='Confirm Password'
								placeholder='Confirm your password'
								required={!isLogin}
								error={formErrors.confirmPassword}
								touched={formTouched.confirmPassword}
								autocomplete='new-password'
							/>
						)}

						{/* Country field (only for register) */}
						{!isLogin && (
							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-2'>
									Country
								</label>
								<CountrySelect
									value={formValues.country}
									onChange={handleFormChange}
									onBlur={handleFormBlur}
									required={!isLogin}
									touched={formTouched.country}
									error={formErrors.country}
								/>
							</div>
						)}

						{/* Submit Button */}
						<button
							type='submit'
							disabled={loading}
							className='group relative w-full bg-yellow-400 text-black font-light py-4 px-6 border border-yellow-400 transition-all duration-700 hover:bg-black hover:text-yellow-400 tracking-[0.15em] uppercase text-sm shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{/* Art Deco corners */}
							<div className='absolute -top-1 -left-1 w-3 h-3 border-l border-t border-yellow-400'></div>
							<div className='absolute -top-1 -right-1 w-3 h-3 border-r border-t border-yellow-400'></div>
							<div className='absolute -bottom-1 -left-1 w-3 h-3 border-l border-b border-yellow-400'></div>
							<div className='absolute -bottom-1 -right-1 w-3 h-3 border-r border-b border-yellow-400'></div>

							<span className='relative z-10'>
								{loading ? (
									<span className='flex items-center justify-center gap-2'>
										<div className='w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin'></div>
										{isLogin ? 'Entering...' : 'Joining...'}
									</span>
								) : isLogin ? (
									'Enter the Speakeasy'
								) : (
									'Join the Elite'
								)}
							</span>
						</button>
					</form>

					{/* Additional Links */}
					<div className='mt-6 text-center'>
						{isLogin && (
							<Link
								to='/forgot-password'
								className='text-gray-400 text-sm hover:text-yellow-400 transition-colors duration-300'
							>
								Forgotten the secret password?
							</Link>
						)}
					</div>
				</div>

				{/* Back to Home */}
				<div className='text-center mt-8'>
					<Link
						to='/'
						className='inline-flex items-center text-gray-400 text-sm hover:text-yellow-400 transition-colors duration-300 group'
					>
						<span className='mr-2 group-hover:-translate-x-1 transition-transform duration-300'>
							←
						</span>
						Back to the Main Hall
					</Link>
				</div>

				{/* Bottom decorative element */}
				<div className='flex items-center justify-center mt-8'>
					<div className='w-16 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
					<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-4'></div>
					<div className='w-16 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
				</div>
			</div>
		</GradientPage>
	);
};

export default LogIn;
