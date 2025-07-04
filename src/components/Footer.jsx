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
		<footer className='bg-black border-t border-yellow-400/20'>
			<div className='max-w-6xl mx-auto px-4'>
				{/* Mobile: Ultra-Compact Single Row */}
				<div className=' py-3'>
					<div className='flex items-center justify-between'>
						{/* Left: Minimal Brand */}
						<div className='flex items-center'>
							<img
								className='h-4 w-auto mr-1.5'
								src={logo}
								alt='BartendersHub'
							/>
							<span className='text-xs text-white font-light'>
								BartendersHub
							</span>
						</div>

						{/* Right: Social + Copyright */}
						<div className='flex items-center space-x-3'>
							{/* Minimal Social Icons */}
							<div className='flex space-x-2'>
								{socialLinks.map((social) => (
									<a
										key={social.name}
										href={social.href}
										className='text-gray-500 hover:text-yellow-400 transition-colors duration-200'
										aria-label={social.name}
									>
										<span className='text-xs'>
											{social.icon}
										</span>
									</a>
								))}
							</div>

							{/* Minimal Copyright */}
							<span className='text-xs text-gray-500'>
								© {currentYear}
							</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
