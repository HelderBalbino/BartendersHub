import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

const VerifyPendingPage = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [email, setEmail] = useState('');
	const [cooldown, setCooldown] = useState(0);

	useEffect(() => {
		const paramEmail = searchParams.get('email');
		if (paramEmail) setEmail(paramEmail);
	}, [searchParams]);

	const handleResend = async () => {
		if (!email) return toast.error('Enter your email first');
		try {
			const res = await apiService.post('/auth/resend-verification', {
				email,
			});
			toast.success(res?.message || res?.data?.message || 'Email sent');
			setCooldown(60);
			const timer = setInterval(() => {
				setCooldown((c) => {
					if (c <= 1) {
						clearInterval(timer);
						return 0;
					}
					return c - 1;
				});
			}, 1000);
		} catch (e) {
			if (e?.status === 429) {
				const retry = e?.data?.retryAfterSeconds || 60;
				setCooldown(retry);
				toast.error(e?.data?.message || 'Too soon, try again later');
			} else {
				toast.error(e?.data?.message || 'Failed to resend');
			}
		}
	};

	const handleChangeEmail = () => {
		navigate('/login?mode=register');
	};

	return (
		<section className='min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 py-12'>
			<div className='max-w-md w-full border border-yellow-400/40 p-8 bg-black/30 backdrop-blur-sm relative'>
				<div className='absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-yellow-400' />
				<div className='absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-yellow-400' />
				<div className='absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-yellow-400' />
				<div className='absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-yellow-400' />
				<h1 className='text-2xl font-light tracking-[0.2em] uppercase text-yellow-400 mb-4'>
					Verify Your Email
				</h1>
				<p className='text-gray-300 text-sm mb-6'>
					We sent a verification link to your email. Please verify to
					continue.
				</p>
				<label className='block text-yellow-400 text-xs tracking-wide uppercase mb-2'>
					Email
				</label>
				<input
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className='w-full bg-black/30 border border-yellow-400/30 text-white px-3 py-2 text-sm focus:outline-none focus:border-yellow-400'
					placeholder='your@email.com'
				/>
				<div className='mt-4 flex flex-col gap-3'>
					<button
						onClick={handleResend}
						disabled={cooldown > 0}
						className='text-yellow-400 text-xs underline disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{cooldown > 0
							? `Resend available in ${cooldown}s`
							: 'Resend verification email'}
					</button>
					<button
						onClick={handleChangeEmail}
						className='text-yellow-400 text-xs underline'
					>
						Change email / Register again
					</button>
					<Link
						to='/login?mode=login'
						className='text-gray-400 text-xs underline hover:text-yellow-400'
					>
						Back to Login
					</Link>
				</div>
			</div>
		</section>
	);
};

export default VerifyPendingPage;
