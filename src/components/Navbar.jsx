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
		{ name: 'Cocktails', href: '#cocktails', icon: '🍸' },
		{ name: 'Masterclass', href: '#masterclass', icon: '🎓' },
		{ name: 'Community', href: '#community', icon: '👥' },
		{ name: 'About', href: '#about', icon: '✨' },
	];

	return (
		<nav
			className={`fixed top-0 w-full z-50 transition-all duration-700 ${
				isScrolled
					? 'bg-black/95 backdrop-blur-md border-b border-yellow-400/30 shadow-2xl'
					: 'bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm'
			}`}
		>
			{/* Art Deco Background Pattern */}
			<div className='absolute inset-0 opacity-5'>
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-400/10 to-transparent'></div>
				<div className='absolute top-2 left-8 w-4 h-4 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-2 right-8 w-4 h-4 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-2 left-1/4 w-3 h-3 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-2 right-1/4 w-3 h-3 border border-yellow-400/20 rotate-45'></div>
			</div>

			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10'>
				<div className='flex h-20 items-center justify-between'>
					{/* Enhanced Logo Section */}
					<div className='flex items-center group'>
						<a
							className='flex flex-shrink-0 items-center relative'
							href='/'
						>
							{/* Art Deco frame around logo */}
							<div className='absolute -inset-2 border border-yellow-400/30 group-hover:border-yellow-400/60 transition-all duration-500'>
								<div className='absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-yellow-400'></div>
								<div className='absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-yellow-400'></div>
								<div className='absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-yellow-400'></div>
								<div className='absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-yellow-400'></div>
							</div>

							<img
								className='block h-14 w-auto transition-all duration-500 group-hover:scale-105 filter group-hover:drop-shadow-lg'
								src={logo}
								alt='BartendersHub Logo'
							/>

							{/* Brand text */}
							<div className='ml-4 hidden sm:block'>
								<span className='text-white font-light text-xl tracking-[0.15em] uppercase'>
									Bartenders
								</span>
								<span className='text-yellow-400 font-extralight text-xl tracking-[0.2em] uppercase ml-2'>
									Hub
								</span>
							</div>
						</a>
					</div>

					{/* Enhanced Desktop Navigation Links */}
					<div className='hidden lg:flex items-center space-x-2'>
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className='group relative bg-transparent text-gray-300 font-light text-sm px-6 py-3 border border-yellow-400/20 transition-all duration-500 hover:border-yellow-400/60 hover:text-white hover:bg-yellow-400/10 hover:shadow-lg tracking-[0.1em] uppercase'
							>
								{/* Art Deco corners */}
								<div className='absolute top-0 left-0 w-2 h-2 border-l border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
								<div className='absolute top-0 right-0 w-2 h-2 border-r border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
								<div className='absolute bottom-0 left-0 w-2 h-2 border-l border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
								<div className='absolute bottom-0 right-0 w-2 h-2 border-r border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>

								{/* Content with icon */}
								<span className='relative z-10 flex items-center gap-2'>
									<span className='text-lg group-hover:scale-110 transition-transform duration-300'>
										{link.icon}
									</span>
									<span>{link.name}</span>
								</span>

								{/* Hover underline effect */}
								<div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-yellow-400 group-hover:w-3/4 transition-all duration-500'></div>
							</a>
						))}

						{/* Premium CTA Button */}
						<div className='ml-6'>
							<a
								href='#join'
								className='group relative bg-yellow-400 text-black font-light px-6 py-3 border-2 border-yellow-400 transition-all duration-500 hover:bg-black hover:text-yellow-400 tracking-[0.1em] uppercase text-sm shadow-lg'
							>
								{/* Enhanced Art Deco corners */}
								<div className='absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-yellow-400'></div>
								<div className='absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-yellow-400'></div>
								<div className='absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-yellow-400'></div>
								<div className='absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-yellow-400'></div>

								<span className='relative z-10 flex items-center gap-2'>
									<span className='text-lg group-hover:rotate-12 transition-transform duration-300'>
										⭐
									</span>
									<span>Join Elite</span>
								</span>
							</a>
						</div>
					</div>

					{/* Enhanced Mobile menu button */}
					<div className='lg:hidden'>
						<button
							onClick={toggleMenu}
							className='group relative text-gray-300 p-3 border border-yellow-400/30 transition-all duration-500 hover:text-yellow-400 hover:border-yellow-400/60 hover:bg-yellow-400/10 focus:outline-none focus:ring-2 focus:ring-yellow-400/50'
							aria-label='Toggle menu'
						>
							{/* Art Deco corners */}
							<div className='absolute top-0 left-0 w-2 h-2 border-l border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
							<div className='absolute top-0 right-0 w-2 h-2 border-r border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
							<div className='absolute bottom-0 left-0 w-2 h-2 border-l border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
							<div className='absolute bottom-0 right-0 w-2 h-2 border-r border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>

							<div className='relative z-10'>
								{isOpen ? (
									<svg
										className='h-6 w-6 transform rotate-90 transition-transform duration-500'
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
										className='h-6 w-6 transition-transform duration-500'
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

				{/* Enhanced Mobile Navigation Menu */}
				<div
					className={`lg:hidden transition-all duration-700 ease-in-out overflow-hidden ${
						isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
					}`}
				>
					{/* Art Deco separator */}
					<div className='px-4 py-2'>
						<div className='flex items-center justify-center'>
							<div className='w-16 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
							<div className='w-2 h-2 border border-yellow-400 rotate-45 mx-4'></div>
							<div className='w-16 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
						</div>
					</div>

					<div className='px-4 pt-2 pb-6 space-y-2 bg-black/80 backdrop-blur-md border-t border-yellow-400/20'>
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								onClick={() => setIsOpen(false)}
								className='group relative block text-gray-300 font-light text-base px-6 py-4 border border-yellow-400/20 transition-all duration-500 hover:border-yellow-400/60 hover:text-white hover:bg-yellow-400/10 hover:translate-x-2 tracking-[0.1em] uppercase'
							>
								{/* Art Deco corners for mobile links */}
								<div className='absolute top-0 left-0 w-2 h-2 border-l border-t border-yellow-400/30 group-hover:border-yellow-400 transition-colors duration-500'></div>
								<div className='absolute top-0 right-0 w-2 h-2 border-r border-t border-yellow-400/30 group-hover:border-yellow-400 transition-colors duration-500'></div>
								<div className='absolute bottom-0 left-0 w-2 h-2 border-l border-b border-yellow-400/30 group-hover:border-yellow-400 transition-colors duration-500'></div>
								<div className='absolute bottom-0 right-0 w-2 h-2 border-r border-b border-yellow-400/30 group-hover:border-yellow-400 transition-colors duration-500'></div>

								<span className='relative z-10 flex items-center gap-3'>
									<span className='text-xl group-hover:scale-110 transition-transform duration-300'>
										{link.icon}
									</span>
									<span>{link.name}</span>
								</span>
							</a>
						))}

						{/* Mobile CTA Button */}
						<div className='pt-4'>
							<a
								href='#join'
								onClick={() => setIsOpen(false)}
								className='group relative block bg-yellow-400 text-black font-light text-center px-6 py-4 border-2 border-yellow-400 transition-all duration-500 hover:bg-black hover:text-yellow-400 tracking-[0.1em] uppercase text-base'
							>
								{/* Enhanced Art Deco corners */}
								<div className='absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-yellow-400'></div>
								<div className='absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-yellow-400'></div>
								<div className='absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-yellow-400'></div>
								<div className='absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-yellow-400'></div>

								<span className='relative z-10 flex items-center justify-center gap-3'>
									<span className='text-xl group-hover:rotate-12 transition-transform duration-300'>
										⭐
									</span>
									<span>Join Elite Community</span>
								</span>
							</a>
						</div>

						{/* Mobile bottom decorative element */}
						<div className='pt-4'>
							<div className='flex items-center justify-center'>
								<div className='w-12 h-0.5 bg-yellow-400/50'></div>
								<div className='w-1 h-1 bg-yellow-400 rounded-full mx-3'></div>
								<div className='text-yellow-400/70 text-xs uppercase tracking-[0.2em] font-light mx-3'>
									Premium Experience
								</div>
								<div className='w-1 h-1 bg-yellow-400 rounded-full mx-3'></div>
								<div className='w-12 h-0.5 bg-yellow-400/50'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
