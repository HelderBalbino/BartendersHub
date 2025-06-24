import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

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
		{ name: 'share a cocktail', to: '/shareCocktail' },
		{ name: 'Community', to: '/community' },
		{ name: 'About', to: '/about' },
	];

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
							<img
								className='h-10 md:h-12 w-auto transition-all duration-300 group-hover:scale-105 filter drop-shadow-md'
								src={logo}
								alt='BartendersHub Logo'
							/>
							<div className='ml-3 md:ml-4 hidden sm:block'>
								<span className='text-white font-light text-lg md:text-xl tracking-[0.15em] uppercase'>
									Bartenders
								</span>
								<span className='text-yellow-400 font-extralight text-lg md:text-xl tracking-[0.2em] uppercase ml-2'>
									Hub
								</span>
							</div>
						</Link>
					</div>

					{/* Clean Desktop Navigation */}
					<div className='hidden lg:flex items-center space-x-8'>
						{navLinks.map((link) => (
							<Link
								key={link.name}
								to={link.to}
								className='text-gray-300 hover:text-yellow-400 font-light text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:scale-105 relative group'
							>
								{link.name}
								<div className='absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300'></div>
							</Link>
						))}

						{/* Elegant CTA Button */}
						<Link
							to='/join'
							className='bg-yellow-400 text-black font-light px-6 py-2.5 transition-all duration-300 hover:bg-transparent hover:text-yellow-400 border-2 border-yellow-400 tracking-[0.1em] uppercase text-sm'
						>
							Join the Hub
						</Link>
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
						isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
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
						{navLinks.map((link) => (
							<Link
								key={link.name}
								to={link.to}
								onClick={() => setIsOpen(false)}
								className='block text-gray-300 hover:text-yellow-400 font-light text-base px-4 py-3 transition-all duration-300 hover:translate-x-2 tracking-[0.1em] uppercase border-l-2 border-transparent hover:border-yellow-400'
							>
								{link.name}
							</Link>
						))}

						{/* Mobile CTA Button */}
						<div className='pt-4'>
							<Link
								to='/join'
								onClick={() => setIsOpen(false)}
								className='block bg-yellow-400 text-black font-light text-center px-6 py-3 transition-all duration-300 hover:bg-transparent hover:text-yellow-400 border-2 border-yellow-400 tracking-[0.1em] uppercase text-sm'
							>
								Join the Hub
							</Link>
						</div>

						{/* Simple bottom accent */}
						<div className='pt-4 text-center'>
							<div className='text-yellow-400/60 text-xs uppercase tracking-[0.2em] font-light'>
								Premium Experience
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
