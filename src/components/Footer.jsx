import logo from '../assets/images/logo.png';
import { FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	const socialLinks = [
		{
			name: 'Instagram',
			href: '#instagram',
			icon: <FaInstagram className='text-2xl' />,
		},
		{
			name: 'Twitter',
			href: '#twitter',
			icon: <FaTwitter className='text-2xl' />,
		},
		{
			name: 'YouTube',
			href: '#youtube',
			icon: <FaYoutube className='text-2xl' />,
		},
	];

	return (
		<footer className='relative bg-gradient-to-br from-black via-gray-900 to-black border-t border-yellow-400/30 overflow-hidden'>
			{/* Simplified Art Deco Background */}
			<div className='absolute inset-0 opacity-5'>
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/8 to-transparent'></div>
				<div className='absolute top-4 left-4 w-8 h-8 md:w-12 md:h-12 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-4 right-4 w-8 h-8 md:w-12 md:h-12 border border-yellow-400/20 rotate-45'></div>
			</div>

			{/* Compact Footer Content */}
			<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 relative z-10'>
				{/* Mobile Layout - Stacked */}
				<div className='block md:hidden'>
					{/* Brand Section */}
					<div className='flex items-center justify-center mb-4'>
						<img
							className='h-8 w-auto mr-3 filter drop-shadow-lg'
							src={logo}
							alt='BartendersHub Logo'
						/>
						<div className='text-left'>
							<span className='block text-lg font-light text-white tracking-[0.15em] uppercase'>
								Bartenders'
							</span>
							<span className='block text-lg font-extralight text-yellow-400 tracking-[0.2em] uppercase'>
								Hub
							</span>
						</div>
					</div>

					{/* Social Links */}
					<div className='flex justify-center space-x-4 mb-4'>
						{socialLinks.map((social) => (
							<a
								key={social.name}
								href={social.href}
								className='text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:scale-110'
								aria-label={social.name}
							>
								<span className='text-xl'>{social.icon}</span>
							</a>
						))}
					</div>

					{/* Copyright */}
					<div className='text-center'>
						<p className='text-gray-500 text-xs font-light tracking-wide mb-2'>
							&copy; {currentYear} BartendersHub • Premium
							Mixology Experience
						</p>
						<div className='text-yellow-400/70 text-xs uppercase tracking-[0.2em] font-light'>
							🥃 Crafted with Excellence 🥃
						</div>
					</div>
				</div>

				{/* Desktop Layout - Grid */}
				<div className='hidden md:grid md:grid-cols-3 md:items-center md:gap-8'>
					{/* Left: Brand */}
					<div className='flex items-center'>
						<img
							className='h-10 w-auto mr-3 filter drop-shadow-lg'
							src={logo}
							alt='BartendersHub Logo'
						/>
						<div className='text-left'>
							<span className='block text-lg font-light text-white tracking-[0.15em] uppercase'>
								Bartenders'
							</span>
							<span className='block text-lg font-extralight text-yellow-400 tracking-[0.2em] uppercase'>
								Hub
							</span>
						</div>
					</div>

					{/* Center: Tagline */}
					<div className='text-center'>
						<p className='text-gray-400 text-sm font-light italic'>
							"Where every pour tells a story"
						</p>
					</div>

					{/* Right: Social & Copyright */}
					<div className='text-right'>
						<div className='flex justify-end space-x-4 mb-2'>
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.href}
									className='text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:scale-110'
									aria-label={social.name}
								>
									<span className='text-lg'>
										{social.icon}
									</span>
								</a>
							))}
						</div>
						<div className='text-xs'>
							<p className='text-gray-500 font-light tracking-wide mb-1'>
								&copy; {currentYear} BartendersHub
							</p>
							<div className='text-yellow-400/70 text-xs uppercase tracking-[0.1em] font-light'>
								🥃 Crafted with Excellence 🥃
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
