import { useState } from 'react';
import logo from '../assets/images/logo.png';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const navLinks = [
		{ name: 'Cocktails', href: '#cocktails' },
		{ name: 'About', href: '#about' },
		{ name: 'Contact', href: '#contact' },
	];

	return (
		<nav className='bg-black border border-gold relative'>
			<div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
				<div className='flex h-20 items-center justify-between'>
					{/* Logo */}
					<div className='flex items-center'>
						<a
							className='flex flex-shrink-0 items-center mr-4'
							href='/index.html'
						>
							<img
								className='block h-16 w-auto'
								src={logo}
								alt='Logo'
							/>
						</a>
					</div>

					{/* Desktop Navigation Links */}
					<div className='hidden md:flex items-center space-x-8'>
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className='text-white font-medium text-lg px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10 hover:scale-105 hover:shadow-lg transform'
							>
								{link.name}
							</a>
						))}
					</div>

					{/* Mobile menu button */}
					<div className='md:hidden'>
						<button
							onClick={toggleMenu}
							className='text-white p-2 rounded-md hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400'
							aria-label='Toggle menu'
						>
							<svg
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								{isOpen ? (
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M6 18L18 6M6 6l12 12'
									/>
								) : (
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M4 6h16M4 12h16M4 18h16'
									/>
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Navigation Menu */}
				<div
					className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
						isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
					}`}
				>
					<div className='px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gold'>
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								onClick={() => setIsOpen(false)}
								className='block text-white font-medium text-lg px-4 py-3 rounded-lg transition-all duration-300 ease-in-out hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10 hover:translate-x-2 transform'
							>
								{link.name}
							</a>
						))}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
