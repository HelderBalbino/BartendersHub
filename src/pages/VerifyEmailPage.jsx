import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const VerifyEmailPage = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const [status, setStatus] = useState('pending'); // pending | success | error
	const [message, setMessage] = useState('Verifying your email...');

	useEffect(() => {
		let cancelled = false;
		async function verify() {
			try {
				const res = await apiService.get(`/auth/verify/${token}`, {
					cache: false,
				});
				if (cancelled) return;
				if (res?.success) {
					setStatus('success');
					setMessage(
						'Email verified successfully! Redirecting to login...',
					);
					setTimeout(() => navigate('/login?mode=login'), 2500);
				} else {
					setStatus('error');
					setMessage(res?.message || 'Verification failed.');
				}
			} catch (e) {
				if (cancelled) return;
				setStatus('error');
				setMessage(
					e?.data?.message || e?.message || 'Verification failed.',
				);
			}
		}
		verify();
		return () => {
			cancelled = true;
		};
	}, [token, navigate]);

	return (
		<section className='min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 py-12'>
			<div className='max-w-md w-full border border-yellow-400/40 p-8 bg-black/30 backdrop-blur-sm text-center relative'>
				<div className='absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-yellow-400' />
				<div className='absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-yellow-400' />
				<div className='absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-yellow-400' />
				<div className='absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-yellow-400' />
				<h1 className='text-2xl font-light tracking-[0.2em] uppercase text-yellow-400 mb-4'>
					Email Verification
				</h1>
				{status === 'pending' && <LoadingSpinner text='Verifying...' />}
				<p
					className={`mt-4 text-sm ${
						status === 'error' ? 'text-red-400' : 'text-gray-300'
					}`}
				>
					{message}
				</p>
				{status === 'error' && (
					<div className='mt-6 space-y-3'>
						<Link
							to='/login?mode=login'
							className='text-yellow-400 underline text-sm'
						>
							Back to Login
						</Link>
						<p className='text-xs text-gray-400'>
							You can request a new verification email from the
							login page.
						</p>
					</div>
				)}
				{status === 'success' && (
					<div className='mt-6'>
						<Link
							to='/login?mode=login'
							className='text-yellow-400 underline text-sm'
						>
							Go to Login Now
						</Link>
					</div>
				)}
			</div>
		</section>
	);
};

export default VerifyEmailPage;
