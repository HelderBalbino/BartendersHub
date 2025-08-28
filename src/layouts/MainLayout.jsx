import { memo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';

// Memoized layout to prevent unnecessary re-renders
const MainLayout = memo(() => {
	const { user, isAuthenticated } = useAuth();
	const [resent, setResent] = useState(false);
	const [cooldown, setCooldown] = useState(0);

	const handleResend = async () => {
		if (!user?.email || cooldown > 0) return;
		try {
			await apiService.post('/auth/resend-verification', {
				email: user.email,
			});
			setResent(true);
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
		} catch {
			/* ignore toast here to keep layout clean */
		}
	};

	const showVerifyBanner = isAuthenticated && user && !user.isVerified;
	return (
		<>
			<Navbar />
			{showVerifyBanner && (
				<div className='bg-gradient-to-r from-yellow-500/20 via-yellow-400/10 to-yellow-500/20 text-yellow-300 text-xs sm:text-sm tracking-wide uppercase border-b border-yellow-400/30 px-4 py-2 flex flex-col sm:flex-row gap-2 items-center justify-center text-center'>
					<span>
						Confirm your email to unlock all features (messages,
						advanced community actions).
					</span>
					<button
						onClick={handleResend}
						disabled={cooldown > 0}
						className='underline hover:text-yellow-200 disabled:opacity-50'
					>
						{cooldown > 0
							? `Resend in ${cooldown}s`
							: resent
							? 'Verification Sent'
							: 'Resend Email'}
					</button>
				</div>
			)}
			<main className='min-h-screen'>
				<Outlet />
			</main>
			<Footer />
		</>
	);
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
