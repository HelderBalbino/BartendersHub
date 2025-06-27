import { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';

const AboutPage = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [currentStat, setCurrentStat] = useState(0);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	const stats = [
		{ number: '100+', label: 'Cocktails', icon: '🍸' },
		{ number: '5+', label: 'Bartenders', icon: '👨‍🍳' },
		{ number: '2', label: 'Countries Served', icon: '🌍' },
		{ number: '1', label: 'Year of Excellence', icon: '⭐' },
	];

	const values = [
		{
			title: 'Craftsmanship',
			description:
				'Every cocktail is a masterpiece, crafted with precision and passion by world-class mixologists.',
			icon: '🎨',
		},
		{
			title: 'Excellence',
			description:
				'We pursue perfection in every detail, from the finest ingredients to the most elegant presentation.',
			icon: '💎',
		},
		{
			title: 'Innovation',
			description:
				'Blending traditional techniques with modern creativity to push the boundaries of mixology.',
			icon: '🔬',
		},
		{
			title: 'Community',
			description:
				'Building a global network of passionate bartenders and cocktail enthusiasts.',
			icon: '🤝',
		},
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentStat((prev) => (prev + 1) % stats.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [stats.length]);

	return (
		<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden'>
			{/* Art Deco Background Pattern */}
			<div className='absolute inset-0 opacity-5'>
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/10 to-transparent'></div>
				<div className='absolute top-8 left-8 w-24 h-24 md:w-32 md:h-32 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-8 right-8 w-20 h-20 md:w-28 md:h-28 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/2 left-1/4 w-16 h-16 md:w-24 md:h-24 border border-yellow-400/15 rotate-45'></div>
				<div className='absolute top-1/4 right-1/3 w-18 h-18 md:w-20 md:h-20 border border-yellow-400/15 rotate-45'></div>
			</div>

			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24'>
				{/* Hero Section */}
				<div
					className={`text-center mb-16 md:mb-20 transition-all duration-1500 ${
						isVisible
							? 'opacity-100 translate-y-0'
							: 'opacity-0 translate-y-10'
					}`}
				>
					{/* Decorative Header */}
					<div className='mb-8 md:mb-12'>
						<div className='w-24 md:w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-4'></div>
						<div className='flex items-center justify-center gap-3 md:gap-4 mb-4'>
							<div className='w-2 h-2 md:w-3 md:h-3 border border-yellow-400 rotate-45 bg-yellow-400'></div>
							<div className='text-yellow-400 text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] font-light'>
								Our Story
							</div>
							<div className='w-2 h-2 md:w-3 md:h-3 border border-yellow-400 rotate-45 bg-yellow-400'></div>
						</div>
						<div className='w-16 md:w-24 h-0.5 bg-yellow-400 mx-auto'></div>
					</div>

					{/* Main Title */}
					<div className='relative border border-yellow-400/40 p-8 md:p-12 lg:p-16 mb-12 md:mb-16 bg-black/20 backdrop-blur-sm max-w-4xl mx-auto'>
						{/* Art Deco corners */}
						<div className='absolute -top-1 -left-1 w-8 md:w-12 h-8 md:h-12 border-l-2 border-t-2 md:border-l-4 md:border-t-4 border-yellow-400'></div>
						<div className='absolute -top-1 -right-1 w-8 md:w-12 h-8 md:h-12 border-r-2 border-t-2 md:border-r-4 md:border-t-4 border-yellow-400'></div>
						<div className='absolute -bottom-1 -left-1 w-8 md:w-12 h-8 md:h-12 border-l-2 border-b-2 md:border-l-4 md:border-b-4 border-yellow-400'></div>
						<div className='absolute -bottom-1 -right-1 w-8 md:w-12 h-8 md:h-12 border-r-2 border-b-2 md:border-r-4 md:border-b-4 border-yellow-400'></div>

						{/* Logo and Brand */}
						<div className='flex items-center justify-center mb-8'>
							<img
								className='h-16 md:h-20 w-auto mr-4 md:mr-6 filter drop-shadow-lg'
								src={logo}
								alt='BartendersHub Logo'
							/>
							<div className='text-left'>
								<span className='block text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-[0.15em] uppercase'>
									Bartenders'
								</span>
								<span className='block text-2xl md:text-3xl lg:text-4xl font-extralight text-yellow-400 tracking-[0.2em] uppercase'>
									Hub
								</span>
							</div>
						</div>

						<h1 className='text-3xl md:text-4xl lg:text-5xl font-extralight text-white mb-6 md:mb-8 leading-tight tracking-[0.1em] uppercase'>
							Crafting Excellence Since{' '}
							<span className='text-yellow-400 font-thin'>
								2025
							</span>
						</h1>

						{/* Elegant separator */}
						<div className='flex items-center justify-center mb-6 md:mb-8'>
							<div className='w-16 md:w-20 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
							<div className='flex items-center mx-4 md:mx-6'>
								<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-2'></div>
								<div className='w-3 md:w-4 h-3 md:h-4 border border-yellow-400 rotate-45 mx-2'></div>
								<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-2'></div>
							</div>
							<div className='w-16 md:w-20 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
						</div>

						<p className='text-lg md:text-xl lg:text-2xl text-gray-300 font-light italic leading-relaxed max-w-3xl mx-auto'>
							"Where passion meets precision, and every cocktail
							tells a story of uncompromising quality and timeless
							elegance."
						</p>
					</div>
				</div>

				{/* Story Section */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mb-16 md:mb-20'>
					<div className='space-y-6 md:space-y-8'>
						<h2 className='text-2xl md:text-3xl font-light text-yellow-400 tracking-[0.15em] uppercase mb-6'>
							Our Legacy
						</h2>
						<div className='space-y-4 md:space-y-6 text-gray-300 leading-relaxed'>
							<p className='text-base md:text-lg font-light'>
								Born from a passion for the golden age of
								cocktails, BartendersHub represents the pinnacle
								of mixological artistry. Our journey began with
								a simple vision: to preserve and elevate the
								sophisticated craft of cocktail creation.
							</p>
							<p className='text-base md:text-lg font-light'>
								Drawing inspiration from the legendary
								speakeasies of the 1920s, we've created a
								platform where master mixologists and cocktail
								enthusiasts converge to share cocktails,
								knowledge, techniques, and the timeless art of
								hospitality.
							</p>
						</div>
					</div>

					{/* Dynamic Stats */}
					<div className='relative'>
						<div className='bg-black/40 border border-yellow-400/40 p-8 md:p-10 backdrop-blur-sm'>
							{/* Art Deco corners */}
							<div className='absolute top-0 left-0 w-6 md:w-8 h-6 md:h-8 border-l-2 border-t-2 border-yellow-400'></div>
							<div className='absolute top-0 right-0 w-6 md:w-8 h-6 md:h-8 border-r-2 border-t-2 border-yellow-400'></div>
							<div className='absolute bottom-0 left-0 w-6 md:w-8 h-6 md:h-8 border-l-2 border-b-2 border-yellow-400'></div>
							<div className='absolute bottom-0 right-0 w-6 md:w-8 h-6 md:h-8 border-r-2 border-b-2 border-yellow-400'></div>

							<div className='text-center transition-all duration-1000'>
								<div className='text-4xl md:text-5xl lg:text-6xl mb-4 filter drop-shadow-lg'>
									{stats[currentStat].icon}
								</div>
								<div className='text-3xl md:text-4xl lg:text-5xl font-light text-yellow-400 mb-3 tracking-wide'>
									{stats[currentStat].number}
								</div>
								<div className='text-lg md:text-xl text-gray-300 font-light tracking-[0.1em] uppercase'>
									{stats[currentStat].label}
								</div>
							</div>
						</div>

						{/* Stats Grid */}
						<div className='grid grid-cols-2 gap-4 mt-8'>
							{stats.map((stat, index) => (
								<div
									key={index}
									className={`text-center p-4 border border-yellow-400/20 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
										index === currentStat
											? 'border-yellow-400/60 bg-yellow-400/10'
											: 'hover:border-yellow-400/40'
									}`}
								>
									<div className='text-2xl mb-2'>
										{stat.icon}
									</div>
									<div className='text-xl font-light text-yellow-400 mb-1'>
										{stat.number}
									</div>
									<div className='text-xs text-gray-400 font-light uppercase tracking-wide'>
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Values Section */}
				<div className='mb-16 md:mb-20'>
					<div className='text-center mb-12 md:mb-16'>
						<h2 className='text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-[0.15em] uppercase mb-4'>
							Our <span className='text-yellow-400'>Values</span>
						</h2>
						<div className='flex items-center justify-center'>
							<div className='w-16 md:w-24 h-0.5 bg-yellow-400/50'></div>
							<div className='w-2 h-2 border border-yellow-400/50 rotate-45 mx-4'></div>
							<div className='w-16 md:w-24 h-0.5 bg-yellow-400/50'></div>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'>
						{values.map((value, index) => (
							<div
								key={index}
								className='group relative bg-black/30 border border-yellow-400/30 p-6 md:p-8 backdrop-blur-sm transition-all duration-500 hover:border-yellow-400/60 hover:bg-yellow-400/5'
							>
								{/* Small Art Deco corners */}
								<div className='absolute top-0 left-0 w-3 h-3 border-l border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
								<div className='absolute top-0 right-0 w-3 h-3 border-r border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
								<div className='absolute bottom-0 left-0 w-3 h-3 border-l border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
								<div className='absolute bottom-0 right-0 w-3 h-3 border-r border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>

								<div className='text-center'>
									<div className='text-3xl md:text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
										{value.icon}
									</div>
									<h3 className='text-yellow-400 font-light mb-4 text-lg md:text-xl tracking-[0.1em] uppercase'>
										{value.title}
									</h3>
									<p className='text-gray-400 text-sm md:text-base font-light leading-relaxed'>
										{value.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Call to Action */}
				<div className='text-center'>
					<div className='relative border border-yellow-400/40 p-8 md:p-12 bg-black/20 backdrop-blur-sm max-w-3xl mx-auto'>
						{/* Art Deco corners */}
						<div className='absolute -top-1 -left-1 w-6 md:w-8 h-6 md:h-8 border-l-2 border-t-2 border-yellow-400'></div>
						<div className='absolute -top-1 -right-1 w-6 md:w-8 h-6 md:h-8 border-r-2 border-t-2 border-yellow-400'></div>
						<div className='absolute -bottom-1 -left-1 w-6 md:w-8 h-6 md:h-8 border-l-2 border-b-2 border-yellow-400'></div>
						<div className='absolute -bottom-1 -right-1 w-6 md:w-8 h-6 md:h-8 border-r-2 border-b-2 border-yellow-400'></div>

						<h2 className='text-2xl md:text-3xl font-light text-white tracking-[0.15em] uppercase mb-6'>
							Join the Hub
						</h2>
						<p className='text-lg md:text-xl text-gray-300 font-light italic mb-8 leading-relaxed'>
							"Become part of a community that celebrates the
							artistry of mixology and the timeless elegance of
							premium cocktails."
						</p>

						<div className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center'>
							<button className='group relative bg-yellow-400 text-black font-light py-3 md:py-4 px-8 md:px-10 border-2 border-yellow-400 transition-all duration-500 hover:bg-black hover:text-yellow-400 tracking-[0.1em] uppercase text-sm'>
								{/* Art Deco corners */}
								<div className='absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-yellow-400'></div>
								<div className='absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-yellow-400'></div>
								<div className='absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-yellow-400'></div>
								<div className='absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-yellow-400'></div>

								<span className='relative z-10'>
									Explore Collection
								</span>
							</button>

							<button className='group relative bg-transparent text-yellow-400 font-light py-3 md:py-4 px-8 md:px-10 border-2 border-yellow-400/60 transition-all duration-500 hover:border-yellow-400 hover:bg-yellow-400/10 tracking-[0.1em] uppercase text-sm'>
								<span className='relative z-10'>
									Join the Hub
								</span>
							</button>
						</div>
					</div>

					{/* Bottom decorative element */}
					<div className='mt-12 md:mt-16'>
						<div className='flex items-center justify-center mb-6'>
							<div className='w-16 md:w-24 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
							<div className='flex items-center mx-6 md:mx-8'>
								<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-2'></div>
								<div className='text-yellow-400 text-xs uppercase tracking-[0.3em] font-light mx-4'>
									Est. 2025
								</div>
								<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-2'></div>
							</div>
							<div className='w-16 md:w-24 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
						</div>

						<p className='text-gray-500 text-sm font-light tracking-[0.2em] uppercase'>
							Crafted with Excellence • Served with Passion •
							Experienced with Pride
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutPage;
