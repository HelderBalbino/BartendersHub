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
			{/* Mobile-First Footer Content */}
			<div className='max-w-6xl mx-auto px-4 py-4 md:py-6 relative z-10'>
				{/* Mobile: Single Column Layout */}
				<div className='md:hidden flex flex-col items-center space-y-3'>
					{/* Brand - Compact */}
					<div className='flex items-center'>
						<img
							className='h-5 w-auto mr-2 filter drop-shadow-lg'
							src={logo}
							alt='BartendersHub Logo'
						/>
						<div className='text-left'>
							<span className='block text-xs font-light text-white tracking-wider uppercase'>
								Bartenders' Hub
							</span>
						</div>
					</div>

					{/* Social Links - Compact */}
					<div className='flex justify-center space-x-4'>
						{socialLinks.map((social) => (
							<a
								key={social.name}
								href={social.href}
								className='text-gray-400 hover:text-yellow-400 transition-all duration-300 p-1'
								aria-label={social.name}
							>
								<span className='text-sm'>{social.icon}</span>
							</a>
						))}
					</div>

					{/* Copyright - Minimal */}
					<div className='text-center'>
						<p className='text-gray-500 text-xs font-light'>
							&copy; {currentYear} BartendersHub
						</p>
					</div>
				</div>

				{/* Desktop: Horizontal Layout */}
				<div className='hidden md:flex md:items-center md:justify-between'>
					{/* Left: Brand */}
					<div className='flex items-center'>
						<img
							className='h-9 w-auto mr-3 filter drop-shadow-lg'
							src={logo}
							alt='BartendersHub Logo'
						/>
						<div className='text-left'>
							<span className='block text-base font-light text-white tracking-[0.1em] uppercase'>
								Bartenders'
							</span>
							<span className='block text-base font-extralight text-yellow-400 tracking-[0.15em] uppercase'>
								Hub
							</span>
						</div>
					</div>

					{/* Center: Social Links */}
					<div className='flex justify-center space-x-6'>
						{socialLinks.map((social) => (
							<a
								key={social.name}
								href={social.href}
								className='text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:scale-110 p-1'
								aria-label={social.name}
							>
								<span className='text-lg'>{social.icon}</span>
							</a>
						))}
					</div>

					{/* Right: Copyright */}
					<div className='text-right'>
						<p className='text-gray-400 text-sm font-light tracking-wide'>
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
