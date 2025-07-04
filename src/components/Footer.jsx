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
		<footer className='relative bg-black border-t border-yellow-400/30 overflow-hidden pt-8 pb-6 md:pt-16 md:pb-10'>
			{/* Compact Footer Content */}
			<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-6 relative z-10'>
				{/* Single Layout for All Screens */}
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4'>
					{/* Left: Brand */}
					<div className='flex items-center justify-center md:justify-start'>
						<img
							className='h-6 md:h-10 w-auto mr-2 md:mr-3 filter drop-shadow-lg'
							src={logo}
							alt='BartendersHub Logo'
						/>
						<div className='text-left'>
							<span className='block text-base md:text-lg font-light text-white tracking-[0.15em] uppercase'>
								Bartenders'
							</span>
							<span className='block text-base md:text-lg font-extralight text-yellow-400 tracking-[0.2em] uppercase'>
								Hub
							</span>
						</div>
					</div>

					{/* Center: Social Links */}
					<div className='flex justify-center space-x-4 md:space-x-6'>
						{socialLinks.map((social) => (
							<a
								key={social.name}
								href={social.href}
								className='text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:scale-110 p-1 md:p-0'
								aria-label={social.name}
							>
								<span className='text-lg md:text-xl'>
									{social.icon}
								</span>
							</a>
						))}
					</div>

					{/* Right: Copyright */}
					<div className='text-center md:text-right'>
						<p className='text-gray-400 text-xs font-light tracking-wide mb-1'>
							&copy; {currentYear} BartendersHub
						</p>
						<div className='text-yellow-400/70 text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] font-light'>
							🥃 Crafted with Excellence 🥃
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
