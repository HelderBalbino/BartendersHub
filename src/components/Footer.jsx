import logo from '../assets/images/logo.png';
import { FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	const quickLinks = [
		{ name: 'Cocktails', href: '#cocktails', icon: '🍸' },
		{ name: 'Share a recipe', href: '#shareRecipe', icon: '🎓' },
		{ name: 'Community', href: '#community', icon: '👥' },
		{ name: 'About', href: '#about', icon: '✨' },
	];

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
				<div className='absolute top-8 left-8 w-16 h-16 md:w-24 md:h-24 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-8 right-8 w-16 h-16 md:w-24 md:h-24 border border-yellow-400/20 rotate-45'></div>
			</div>

			{/* Main Footer Content - Simplified Layout */}
			<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-16 relative z-10'>
				{/* Central Brand Section */}
				<div className='text-center mb-12'>
					<div className='flex items-center justify-center mb-6'>
						<img
							className='h-12 md:h-16 w-auto mr-4 filter drop-shadow-lg'
							src={logo}
							alt='BartendersHub Logo'
						/>
						<div className='text-left'>
							<span className='block text-xl md:text-2xl font-light text-white tracking-[0.15em] uppercase'>
								Bartenders'
							</span>
							<span className='block text-xl md:text-2xl font-extralight text-yellow-400 tracking-[0.2em] uppercase'>
								Hub
							</span>
						</div>
					</div>

					<p className='text-gray-400 text-sm md:text-base leading-relaxed font-light italic mb-8 max-w-2xl mx-auto'>
						"Where every pour tells a story of craftsmanship and
						passion"
					</p>

					{/* Simple Navigation Links */}
					<div className='flex flex-wrap justify-center gap-6 md:gap-8 mb-8'>
						{quickLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className='group flex items-center text-gray-400 hover:text-yellow-400 text-sm md:text-base transition-all duration-300 hover:scale-105 touch-manipulation'
							>
								<span className='text-lg mr-2 group-hover:scale-110 transition-transform duration-300'>
									{link.icon}
								</span>
								<span className='uppercase tracking-wide font-light'>
									{link.name}
								</span>
							</a>
						))}
					</div>

					{/* Simple Social Links */}
					<div className='flex justify-center space-x-6 mb-8'>
						{socialLinks.map((social) => (
							<a
								key={social.name}
								href={social.href}
								className='group text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:scale-110 touch-manipulation'
								aria-label={social.name}
							>
								<span className='text-2xl'>{social.icon}</span>
							</a>
						))}
					</div>

					{/* Elegant Separator */}
					<div className='flex items-center justify-center mb-8'>
						<div className='w-16 md:w-24 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
						<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-4'></div>
						<div className='w-16 md:w-24 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
					</div>

					{/* Simple Copyright */}
					<div className='text-center'>
						<p className='text-gray-500 text-sm font-light tracking-wide mb-4'>
							&copy; {currentYear} BartendersHub • Premium
							Mixology Experience
						</p>
						<div className='text-yellow-400/70 text-xs uppercase tracking-[0.2em] font-light'>
							🥃 Crafted with Excellence 🥃
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
