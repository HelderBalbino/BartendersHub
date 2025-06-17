import logo from '../assets/images/logo.png';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		explore: [
			{ name: 'Cocktail Recipes', href: '#recipes' },
			{ name: 'Bartending Guides', href: '#guides' },
			{ name: 'Trending Drinks', href: '#trending' },
			{ name: 'Classic Cocktails', href: '#classics' },
		],
		community: [
			{ name: 'Join Community', href: '#community' },
			{ name: 'Bartender Stories', href: '#stories' },
			{ name: 'Share Recipe', href: '#share' },
			{ name: 'Events', href: '#events' },
		],
		support: [
			{ name: 'Help Center', href: '#help' },
			{ name: 'Contact Us', href: '#contact' },
			{ name: 'Privacy Policy', href: '#privacy' },
			{ name: 'Terms of Service', href: '#terms' },
		],
	};

	const socialLinks = [
		{
			name: 'Instagram',
			href: '#instagram',
			icon: (
				<svg
					className='w-5 h-5'
					fill='currentColor'
					viewBox='0 0 24 24'
				>
					<path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L3.468 17.34c.88.807 2.031 1.297 3.328 1.297.44 0 .88-.073 1.297-.22v-1.428c-.44.147-.857.22-1.297.22-.44 0-.857-.073-1.224-.22v1.428c.367.147.784.22 1.224.22zm7.518 0c.44 0 .857-.073 1.224-.22v-1.428c-.367.147-.784.22-1.224.22-.44 0-.857-.073-1.297-.22v1.428c.44.147.857.22 1.297.22z' />
				</svg>
			),
		},
		{
			name: 'Twitter',
			href: '#twitter',
			icon: (
				<svg
					className='w-5 h-5'
					fill='currentColor'
					viewBox='0 0 24 24'
				>
					<path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
				</svg>
			),
		},
		{
			name: 'Facebook',
			href: '#facebook',
			icon: (
				<svg
					className='w-5 h-5'
					fill='currentColor'
					viewBox='0 0 24 24'
				>
					<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
				</svg>
			),
		},
		{
			name: 'YouTube',
			href: '#youtube',
			icon: (
				<svg
					className='w-5 h-5'
					fill='currentColor'
					viewBox='0 0 24 24'
				>
					<path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
				</svg>
			),
		},
	];

	return (
		<footer className='bg-black border-t border-yellow-400'>
			{/* Main Footer Content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
					{/* Logo and Description */}
					<div className='lg:col-span-1'>
						<div className='flex items-center mb-4'>
							<img
								className='h-12 w-auto mr-3'
								src={logo}
								alt='Bartenders Hub Logo'
							/>
							<span className='text-xl font-bold text-white'>
								Bartenders'
								<span className='text-yellow-400'>Hub</span>
							</span>
						</div>
						<p className='text-gray-400 text-sm mb-4 leading-relaxed'>
							Where every pour tells a story. Master the art of
							mixology and connect with fellow bartenders
							worldwide.
						</p>

						{/* Social Links */}
						<div className='flex space-x-4'>
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.href}
									className='text-gray-400 hover:text-yellow-400 transition-colors duration-300 transform hover:scale-110'
									aria-label={social.name}
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>

					{/* Explore Links */}
					<div>
						<h3 className='text-yellow-400 font-semibold text-lg mb-4 border-b border-yellow-400 border-opacity-30 pb-2'>
							Explore
						</h3>
						<ul className='space-y-2'>
							{footerLinks.explore.map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className='text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:translate-x-1 transform inline-block'
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Community Links */}
					<div>
						<h3 className='text-yellow-400 font-semibold text-lg mb-4 border-b border-yellow-400 border-opacity-30 pb-2'>
							Community
						</h3>
						<ul className='space-y-2'>
							{footerLinks.community.map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className='text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:translate-x-1 transform inline-block'
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Support Links */}
					<div>
						<h3 className='text-yellow-400 font-semibold text-lg mb-4 border-b border-yellow-400 border-opacity-30 pb-2'>
							Support
						</h3>
						<ul className='space-y-2'>
							{footerLinks.support.map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className='text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:translate-x-1 transform inline-block'
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Newsletter Signup */}
				<div className='mt-8 pt-8 border-t border-gray-800'>
					<div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
						<div className='text-center lg:text-left'>
							<h3 className='text-yellow-400 font-semibold text-lg mb-2'>
								🍸 Stay Updated
							</h3>
							<p className='text-gray-400 text-sm'>
								Get the latest cocktail recipes and bartending
								tips delivered to your inbox.
							</p>
						</div>
						<div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
							<input
								type='email'
								placeholder='Enter your email'
								className='px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors duration-300 flex-1 lg:w-64'
							/>
							<button className='px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 whitespace-nowrap'>
								Subscribe
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className='bg-gray-900 border-t border-gray-800'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
						<p className='text-gray-500 text-sm text-center sm:text-left'>
							&copy; {currentYear} Bartenders Hub. All rights
							reserved.
						</p>
						<div className='flex items-center gap-2 text-gray-500 text-sm'>
							<span>Made with</span>
							<span className='text-red-500 animate-pulse'>
								❤️
							</span>
							<span>for bartenders worldwide</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
