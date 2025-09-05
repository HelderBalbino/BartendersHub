import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import logoAvif256 from '../assets/images/optimized/logo-256.avif';
import logoWebp256 from '../assets/images/optimized/logo-256.webp';
import logoPng256 from '../assets/images/optimized/logo-256.png';
import logoAvif512 from '../assets/images/optimized/logo-512.avif';
import logoWebp512 from '../assets/images/optimized/logo-512.webp';
import logoPng512 from '../assets/images/optimized/logo-512.png';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const { isAuthenticated, user, logout } = useAuth();

	// Handle scroll effect for navbar backdrop
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const navLinks = [
		{ name: 'Cocktails', to: '/cocktails' },
		{ name: 'About', to: '/about' },
	];

	// Add auth-specific links for authenticated users
	const authNavLinks = isAuthenticated
		? [
				{ name: 'Add a cocktail', to: '/addCocktail' },
				{ name: 'Community', to: '/community' },
				...navLinks,
		  ]
		: navLinks;

	return (
		<nav
			className={`fixed top-0 w-full z-50 transition-all duration-500 ${
				isScrolled
					? 'bg-black/95 backdrop-blur-md border-b border-yellow-400/20 shadow-lg'
					: 'bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm'
			}`}
		>
			{/* Subtle Art Deco Background */}
			<div className='absolute inset-0 opacity-3'>
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-400/5 to-transparent'></div>
			</div>

			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10'>
				<div className='flex h-16 md:h-20 items-center justify-between'>
					{/* Simplified Logo Section */}
					<div className='flex items-center'>
						<Link
							className='flex flex-shrink-0 items-center group'
							to='/'
						>
							<picture>
								<source
									type='image/avif'
									srcSet={`${logoAvif256} 256w, ${logoAvif512} 512w`}
									sizes='(min-width: 768px) 48px, 40px'
								/>
								<source
									type='image/webp'
									srcSet={`${logoWebp256} 256w, ${logoWebp512} 512w`}
									sizes='(min-width: 768px) 48px, 40px'
								/>
								<img
									className='h-10 md:h-12 w-auto transition-all duration-300 group-hover:scale-105 filter drop-shadow-md'
									src={logoPng256}
									srcSet={`${logoPng256} 256w, ${logoPng512} 512w`}
									sizes='(min-width: 768px) 48px, 40px'
									alt='BartendersHub Logo'
								/>
							</picture>
							<div className='ml-3 md:ml-4 hidden xs:block'>
								<span className='text-white font-light text-base md:text-lg lg:text-xl tracking-[0.1em] sm:tracking-[0.15em] uppercase'>
									Bartenders'
								</span>
								<span className='text-yellow-400 font-extralight text-base md:text-lg lg:text-xl tracking-[0.15em] sm:tracking-[0.2em] uppercase ml-1 sm:ml-2'>
									Hub
								</span>
							</div>
						</Link>
					</div>

					{/* Clean Desktop Navigation */}
					<div className='hidden lg:flex items-center space-x-8'>
						{authNavLinks.map((link) => (
							<Link
								key={link.name}
								to={link.to}
								className='text-gray-300 hover:text-yellow-400 font-light text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:scale-105 relative group'
							>
								{link.name}
								<div className='absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300'></div>
							</Link>
						))}

						{/* Navigation Buttons */}
						<div className='flex items-center gap-3'>
							{isAuthenticated ? (
								/* Authenticated User Menu */
								<div className='flex items-center gap-4'>
									<div className='flex items-center gap-3'>
										<div className='text-gray-300 text-sm'>
											Welcome,{' '}
											<span className='text-yellow-400'>
												{user?.name || user?.username}
											</span>
										</div>
										{/* Profile Circle */}
										<Link
											to='/profile'
											className='group relative'
											title='View Profile'
										>
											<div className='w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/25 border-2 border-yellow-400/20 hover:border-yellow-400/60'>
												<span className='text-black font-semibold text-sm uppercase'>
													{(
														user?.name ||
														user?.username ||
														'U'
													).charAt(0)}
												</span>
											</div>
											{/* Hover tooltip */}
											<div className='absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-yellow-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-yellow-400/30'>
												View Profile
											</div>
										</Link>
									</div>
									<button
										onClick={logout}
										className='bg-transparent text-yellow-400 font-light px-4 py-2 transition-all duration-300 hover:bg-yellow-400/10 border border-yellow-400/60 hover:border-yellow-400 tracking-[0.1em] uppercase text-sm'
									>
										Logout
									</button>
								</div>
							) : (
								/* Unauthenticated User Buttons */
								<>
									<Link
										to='/login?mode=login'
										className='bg-transparent text-yellow-400 font-light px-4 py-2 transition-all duration-300 hover:bg-yellow-400/10 border border-yellow-400/60 hover:border-yellow-400 tracking-[0.1em] uppercase text-sm'
									>
										Login
									</Link>
									<Link
										to='/login?mode=register'
										className='bg-yellow-400 text-black font-light px-6 py-2.5 transition-all duration-300 hover:bg-transparent hover:text-yellow-400 border-2 border-yellow-400 tracking-[0.1em] uppercase text-sm'
									>
										Join the Hub
									</Link>
								</>
							)}
						</div>
					</div>

					{/* Simplified Mobile Menu Button */}
					<div className='lg:hidden'>
						<button
							onClick={toggleMenu}
							className='text-gray-300 hover:text-yellow-400 p-2 transition-all duration-300 focus:outline-none'
							aria-label='Toggle menu'
						>
							<div className='relative'>
								{isOpen ? (
									<svg
										className='h-6 w-6 transform rotate-90 transition-transform duration-300'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M6 18L18 6M6 6l12 12'
										/>
									</svg>
								) : (
									<svg
										className='h-6 w-6 transition-transform duration-300'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M4 6h16M4 12h16M4 18h16'
										/>
									</svg>
								)}
							</div>
						</button>
					</div>
				</div>

				{/* Clean Mobile Navigation Menu */}
				<div
					className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
						isOpen ? 'max-h-99 opacity-100' : 'max-h-0 opacity-0'
					}`}
				>
					{/* Elegant separator */}
					<div className='px-4 py-3'>
						<div className='flex items-center justify-center'>
							<div className='w-16 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
							<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-4'></div>
							<div className='w-16 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
						</div>
					</div>

					<div className='px-4 pb-6 space-y-3 bg-black/90 backdrop-blur-md border-t border-yellow-400/20'>
						{authNavLinks.map((link) => (
							<Link
								key={link.name}
								to={link.to}
								onClick={() => setIsOpen(false)}
								className='block text-gray-300 hover:text-yellow-400 font-light text-base px-4 py-3 transition-all duration-300 hover:translate-x-2 tracking-[0.1em] uppercase border-l-2 border-transparent hover:border-yellow-400'
							>
								{link.name}
							</Link>
						))}{' '}
						{/* Mobile Action Buttons */}
						<div className='pt-4 space-y-4'>
							{isAuthenticated ? (
								/* Authenticated User Menu */
								<>
									<div className='flex items-center justify-center gap-3 px-4 py-2'>
										<div className='text-center text-gray-300 text-sm'>
											Welcome,{' '}
											<span className='text-yellow-400'>
												{user?.name || user?.username}
											</span>
										</div>
										{/* Mobile Profile Circle */}
										<Link
											to='/profile'
											onClick={() => setIsOpen(false)}
											className='group relative'
											title='View Profile'
										>
											<div className='w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-yellow-400/20 hover:border-yellow-400/60'>
												<span className='text-black font-semibold text-sm uppercase'>
													{(
														user?.name ||
														user?.username ||
														'U'
													).charAt(0)}
												</span>
											</div>
										</Link>
									</div>
									<button
										onClick={() => {
											logout();
											setIsOpen(false);
										}}
										className='block w-full bg-transparent text-yellow-400 font-light text-center px-6 py-4 transition-all duration-300 hover:bg-yellow-400/10 border border-yellow-400/60 hover:border-yellow-400 tracking-[0.1em] uppercase text-sm btn-touch'
									>
										Logout
									</button>
								</>
							) : (
								/* Unauthenticated User Buttons */
								<>
									<Link
										to='/login?mode=login'
										onClick={() => setIsOpen(false)}
										className='block bg-transparent text-yellow-400 font-light text-center px-6 py-4 transition-all duration-300 hover:bg-yellow-400/10 border border-yellow-400/60 hover:border-yellow-400 tracking-[0.1em] uppercase text-sm btn-touch'
									>
										Login
									</Link>
									<Link
										to='/login?mode=register'
										onClick={() => setIsOpen(false)}
										className='block bg-yellow-400 text-black font-light text-center px-6 py-4 transition-all duration-300 hover:bg-transparent hover:text-yellow-400 border-2 border-yellow-400 tracking-[0.1em] uppercase text-sm btn-touch'
									>
										Join the Hub
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
