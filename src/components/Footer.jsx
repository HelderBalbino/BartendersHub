import logo from '../assets/images/logo.png';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	const quickLinks = [
		{ name: 'Cocktails', href: '#cocktails', icon: '🍸' },
		{ name: 'Masterclass', href: '#masterclass', icon: '🎓' },
		{ name: 'Community', href: '#community', icon: '👥' },
		{ name: 'About', href: '#about', icon: '✨' },
	];

	const socialLinks = [
		{
			name: 'Instagram',
			href: '#instagram',
			icon: '📸',
		},
		{
			name: 'Twitter',
			href: '#twitter',
			icon: '🐦',
		},
		{
			name: 'YouTube',
			href: '#youtube',
			icon: '📺',
		},
	];

	return (
		<footer className='relative bg-gradient-to-br from-black via-gray-900 to-black border-t-2 border-yellow-400/40 overflow-hidden'>
			{/* Art Deco Background Pattern - Mobile Optimized */}
			<div className='absolute inset-0 opacity-5'>
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/10 to-transparent'></div>
				<div className='absolute top-4 left-4 w-12 h-12 md:top-8 md:left-8 md:w-24 md:h-24 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-4 right-4 w-10 h-10 md:bottom-8 md:right-8 md:w-20 md:h-20 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/2 left-1/4 w-8 h-8 md:w-16 md:h-16 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/4 right-1/4 w-9 h-9 md:w-18 md:h-18 border border-yellow-400/20 rotate-45'></div>
			</div>

			{/* Top decorative border - Mobile Optimized */}
			<div className='relative z-10 py-1 md:py-2'>
				<div className='flex items-center justify-center'>
					<div className='w-16 md:w-32 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
					<div className='flex items-center mx-3 md:mx-6'>
						<div className='w-1.5 h-1.5 md:w-2 md:h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-1 md:mx-2'></div>
						<div className='w-2 h-2 md:w-3 md:h-3 border border-yellow-400 rotate-45 mx-1 md:mx-2'></div>
						<div className='w-1.5 h-1.5 md:w-2 md:h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-1 md:mx-2'></div>
					</div>
					<div className='w-16 md:w-32 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
				</div>
			</div>
			{/* Main Footer Content - Mobile First Layout */}
			<div className='max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12'>
					{/* Brand Section with Art Deco Frame - Mobile Optimized */}
					<div className='lg:col-span-1 text-center'>
						<div className='relative border border-yellow-400/30 p-4 md:p-6 bg-black/20 backdrop-blur-sm'>
							{/* Art Deco corners - Mobile Responsive */}
							<div className='absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-l-2 border-t-2 border-yellow-400'></div>
							<div className='absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-r-2 border-t-2 border-yellow-400'></div>
							<div className='absolute bottom-0 left-0 w-3 h-3 md:w-4 md:h-4 border-l-2 border-b-2 border-yellow-400'></div>
							<div className='absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-r-2 border-b-2 border-yellow-400'></div>

							<div className='flex items-center justify-center mb-4 md:mb-6'>
								<img
									className='h-10 md:h-14 w-auto mr-3 md:mr-4 filter drop-shadow-lg'
									src={logo}
									alt='BartendersHub Logo'
								/>
								<div className='text-left'>
									<span className='block text-lg md:text-xl font-light text-white tracking-[0.15em] uppercase'>
										Bartenders
									</span>
									<span className='block text-lg md:text-xl font-extralight text-yellow-400 tracking-[0.2em] uppercase'>
										Hub
									</span>
								</div>
							</div>

							<p className='text-gray-400 text-xs md:text-sm leading-relaxed font-light italic mb-4 md:mb-6 px-2'>
								"Where every pour tells a story of craftsmanship
								and passion. Join the elite community of master
								mixologists."
							</p>

							{/* Elegant decorative separator - Mobile Responsive */}
							<div className='flex items-center justify-center mb-4 md:mb-6'>
								<div className='w-8 md:w-12 h-0.5 bg-yellow-400/50'></div>
								<div className='w-1.5 h-1.5 md:w-2 md:h-2 border border-yellow-400 rotate-45 mx-2 md:mx-3'></div>
								<div className='w-8 md:w-12 h-0.5 bg-yellow-400/50'></div>
							</div>

							{/* Social Links with Art Deco styling - Mobile Touch Friendly */}
							<div className='flex justify-center space-x-3 md:space-x-4'>
								{socialLinks.map((social) => (
									<a
										key={social.name}
										href={social.href}
										className='group relative w-10 h-10 md:w-12 md:h-12 bg-black/40 border border-yellow-400/30 flex items-center justify-center transition-all duration-500 hover:border-yellow-400 hover:bg-yellow-400/10 hover:scale-110 touch-manipulation'
										aria-label={social.name}
									>
										{/* Art Deco corners for social icons - Mobile Responsive */}
										<div className='absolute top-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-l border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
										<div className='absolute top-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-r border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
										<div className='absolute bottom-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-l border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
										<div className='absolute bottom-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-r border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>

										<span className='text-lg md:text-xl text-gray-400 group-hover:text-yellow-400 transition-colors duration-500'>
											{social.icon}
										</span>
									</a>
								))}
							</div>
						</div>
					</div>

					{/* Quick Navigation - Mobile Optimized */}
					<div className='text-center'>
						<div className='mb-6 md:mb-8'>
							<h3 className='text-yellow-400 font-light text-base md:text-lg mb-4 md:mb-6 tracking-[0.15em] uppercase flex items-center justify-center'>
								<span className='mr-2 md:mr-3 text-lg md:text-xl'>
									🗺️
								</span>
								<span>Navigation</span>
							</h3>

							<div className='space-y-2 md:space-y-3'>
								{quickLinks.map((link) => (
									<a
										key={link.name}
										href={link.href}
										className='group flex items-center justify-center text-gray-400 hover:text-white text-sm md:text-sm transition-all duration-500 hover:translate-x-2 font-light tracking-wide touch-manipulation py-2'
									>
										<span className='text-base md:text-lg mr-2 md:mr-3 group-hover:scale-110 transition-transform duration-300'>
											{link.icon}
										</span>
										<span className='uppercase tracking-[0.1em]'>
											{link.name}
										</span>
									</a>
								))}
							</div>
						</div>
					</div>

					{/* Premium Newsletter with Art Deco styling - Mobile Optimized */}
					<div className='text-center'>
						<div className='relative border border-yellow-400/30 p-4 md:p-6 bg-black/20 backdrop-blur-sm'>
							{/* Art Deco corners - Mobile Responsive */}
							<div className='absolute top-0 left-0 w-2.5 h-2.5 md:w-3 md:h-3 border-l-2 border-t-2 border-yellow-400'></div>
							<div className='absolute top-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 border-r-2 border-t-2 border-yellow-400'></div>
							<div className='absolute bottom-0 left-0 w-2.5 h-2.5 md:w-3 md:h-3 border-l-2 border-b-2 border-yellow-400'></div>
							<div className='absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 border-r-2 border-b-2 border-yellow-400'></div>

							<h3 className='text-yellow-400 font-light text-base md:text-lg mb-3 md:mb-4 tracking-[0.15em] uppercase flex items-center justify-center'>
								<span className='text-xl md:text-2xl mr-2 md:mr-3'>
									📬
								</span>
								<span>Elite Updates</span>
							</h3>

							<p className='text-gray-400 text-xs md:text-sm mb-4 md:mb-6 font-light leading-relaxed px-2'>
								Receive exclusive cocktail recipes, industry
								insights, and masterclass invitations.
							</p>

							<div className='space-y-2 md:space-y-3'>
								<input
									type='email'
									placeholder='Enter your email'
									className='w-full px-3 md:px-4 py-2.5 md:py-3 bg-black/40 border border-yellow-400/30 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:bg-black/60 transition-all duration-500 font-light text-sm tracking-wide touch-manipulation'
								/>
								<button className='group relative w-full bg-yellow-400 text-black font-light py-2.5 md:py-3 px-4 md:px-6 border-2 border-yellow-400 transition-all duration-500 hover:bg-black hover:text-yellow-400 tracking-[0.1em] uppercase text-sm touch-manipulation'>
									{/* Art Deco corners for button - Mobile Responsive */}
									<div className='absolute top-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-l border-t border-yellow-400'></div>
									<div className='absolute top-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-r border-t border-yellow-400'></div>
									<div className='absolute bottom-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-l border-b border-yellow-400'></div>
									<div className='absolute bottom-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-r border-b border-yellow-400'></div>

									<span className='relative z-10 flex items-center justify-center gap-2'>
										<span>Join Elite Circle</span>
										<span className='text-base md:text-lg group-hover:translate-x-1 transition-transform duration-300'>
											→
										</span>
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Enhanced Bottom Section with Art Deco styling - Mobile Optimized */}
			<div className='relative border-t border-yellow-400/30 bg-black/40 backdrop-blur-sm'>
				<div className='max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10'>
					{/* Decorative top border - Mobile Responsive */}
					<div className='flex items-center justify-center mb-4 md:mb-6'>
						<div className='w-16 md:w-24 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
						<div className='w-1.5 h-1.5 md:w-2 md:h-2 border border-yellow-400 rotate-45 mx-3 md:mx-4'></div>
						<div className='w-16 md:w-24 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
					</div>

					<div className='text-center'>
						{/* Copyright and tagline - Mobile Typography */}
						<p className='text-gray-500 text-xs md:text-sm font-light tracking-[0.1em] uppercase mb-3 md:mb-4'>
							&copy; {currentYear} BartendersHub • Crafted with
							Excellence
						</p>

						{/* Premium tagline - Mobile Stack Layout */}
						<div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-gray-500 text-xs font-light tracking-[0.15em] uppercase mb-4 md:mb-6'>
							<span>Est. 2025</span>
							<div className='hidden sm:block w-1 h-1 bg-yellow-400 rounded-full'></div>
							<span>Premium Mixology Experience</span>
							<div className='hidden sm:block w-1 h-1 bg-yellow-400 rounded-full'></div>
							<span>Elite Community</span>
						</div>

						{/* Final decorative element - Mobile Responsive */}
						<div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0'>
							<div className='hidden sm:flex items-center'>
								<div className='w-2 h-2 md:w-3 md:h-3 border border-yellow-400/50 rotate-45 mx-1 md:mx-2'></div>
								<div className='w-6 md:w-8 h-0.5 bg-yellow-400/50'></div>
								<div className='w-0.5 h-0.5 md:w-1 md:h-1 bg-yellow-400 rounded-full mx-2 md:mx-3'></div>
							</div>
							<div className='text-yellow-400/70 text-xs uppercase tracking-[0.2em] font-light mx-0 sm:mx-3'>
								🥃 Cheers to Excellence 🥃
							</div>
							<div className='hidden sm:flex items-center'>
								<div className='w-0.5 h-0.5 md:w-1 md:h-1 bg-yellow-400 rounded-full mx-2 md:mx-3'></div>
								<div className='w-6 md:w-8 h-0.5 bg-yellow-400/50'></div>
								<div className='w-2 h-2 md:w-3 md:h-3 border border-yellow-400/50 rotate-45 mx-1 md:mx-2'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
