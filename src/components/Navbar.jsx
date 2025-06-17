import logo from '../assets/images/logo.png';

const Navbar = () => {
	return (
		<nav className='bg-black border border-gold'>
			<div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
				<div className='flex h-20 items-center justify-between'>
					<div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
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
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
