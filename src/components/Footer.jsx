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
		<footer className='relative bg-black border-t border-yellow-400/30 overflow-hidden'>
			{/* Compact Footer Content */}
			<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10'>
				{/* Single Layout for All Screens */}
				<div className='flex flex-col items-center md:flex-row md:items-center md:justify-between gap-4 md:gap-6'>
					{/* Left: Brand */}
					<div className='flex items-center'>
						<img
							className='h-7 md:h-9 w-auto mr-2 md:mr-3 filter drop-shadow-lg'
							src={logo}
							alt='BartendersHub Logo'
						/>
						<div className='text-left'>
							<span className='block text-sm md:text-base font-light text-white tracking-[0.1em] uppercase'>
								Bartenders'
							</span>
							<span className='block text-sm md:text-base font-extralight text-yellow-400 tracking-[0.15em] uppercase'>
								Hub
							</span>
						</div>
					</div>

					{/* Center: Social Links */}
					<div className='flex justify-center space-x-5 md:space-x-6'>
						{socialLinks.map((social) => (
							<a
								key={social.name}
								href={social.href}
								className='text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:scale-110 p-2 md:p-1'
								aria-label={social.name}
							>
								<span className='text-base md:text-lg'>
									{social.icon}
								</span>
							</a>
						))}
					</div>

					{/* Right: Copyright */}
					<div className='text-center md:text-right'>
						<p className='text-gray-400 text-xs md:text-sm font-light tracking-wide'>
							&copy; {currentYear} BartendersHub
						</p>
						<div className='text-yellow-400/80 text-xs font-light mt-1'>
							🥃 Crafted with Excellence
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
