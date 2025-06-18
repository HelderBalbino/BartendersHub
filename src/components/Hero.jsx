import { useState, useEffect } from 'react';

const Hero = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [currentQuote, setCurrentQuote] = useState(0);
	const [currentFeature, setCurrentFeature] = useState(0);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	// Sophisticated cocktail quotes for the speakeasy atmosphere
	const speakeasyQuotes = [
		'Where sophistication meets artistry',
		'Crafting liquid poetry since 1925',
		'Every cocktail tells a story',
		'The art of fine mixology',
		'Excellence in every drop',
	];

	const premiumFeatures = [
		{
			icon: '👑',
			title: 'Premium Collection',
			desc: 'Curated selection of world-class cocktails',
		},
		{
			icon: '🎭',
			title: 'Master Classes',
			desc: 'Learn from legendary mixologists',
		},
		{
			icon: '🌟',
			title: 'Exclusive Community',
			desc: 'Connect with elite bartenders worldwide',
		},
		{
			icon: '💎',
			title: 'Artisan Crafted',
			desc: 'Hand-selected ingredients and techniques',
		},
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentQuote((prev) => (prev + 1) % speakeasyQuotes.length);
		}, 4000);
		return () => clearInterval(interval);
	}, [speakeasyQuotes.length]);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentFeature((prev) => (prev + 1) % premiumFeatures.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [premiumFeatures.length]);

	return (
		<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden'>
			{/* Enhanced Art Deco Background Pattern */}
			<div className='absolute inset-0 opacity-8'>
				{/* Golden gradient overlay */}
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/15 via-transparent to-yellow-400/5'></div>

				{/* Geometric Art Deco elements - more sophisticated layout */}
				<div className='absolute top-16 left-16 w-48 h-48 border border-yellow-400/25 rotate-45'></div>
				<div className='absolute bottom-16 right-16 w-40 h-40 border border-yellow-400/25 rotate-45'></div>
				<div className='absolute top-1/2 left-8 w-32 h-32 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/4 right-8 w-36 h-36 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-1/4 left-1/4 w-28 h-28 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-3/4 right-1/3 w-24 h-24 border border-yellow-400/20 rotate-45'></div>

				{/* Sophisticated radiating lines pattern */}
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
					<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent rotate-15'></div>
					<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent rotate-30'></div>
					<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent rotate-45'></div>
					<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent -rotate-15'></div>
					<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent -rotate-30'></div>
					<div className='w-screen h-0.5 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent -rotate-45'></div>
				</div>

				{/* Additional decorative elements */}
				<div className='absolute top-20 left-1/2 transform -translate-x-1/2 w-64 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent'></div>
				<div className='absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent'></div>
			</div>

			{/* Main content - redesigned with enhanced Art Deco styling */}
			<div
				className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-1500 ${
					isVisible
						? 'opacity-100 translate-y-0'
						: 'opacity-0 translate-y-10'
				}`}
			>
				{/* Enhanced top decorative section */}
				<div className='mb-12'>
					<div className='w-40 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-4'></div>
					<div className='flex items-center justify-center gap-4 mb-4'>
						<div className='w-3 h-3 border border-yellow-400 rotate-45 bg-yellow-400'></div>
						<div className='text-yellow-400 text-xs uppercase tracking-[0.3em] font-light'>
							Premium Mixology Experience
						</div>
						<div className='w-3 h-3 border border-yellow-400 rotate-45 bg-yellow-400'></div>
					</div>
					<div className='w-24 h-0.5 bg-yellow-400 mx-auto'></div>
				</div>

				{/* Enhanced main frame with sophisticated styling */}
				<div className='relative border-2 border-yellow-400/40 p-6 sm:p-10 lg:p-16 mb-16 bg-black/20 backdrop-blur-sm'>
					{/* Enhanced Art Deco corner decorations */}
					<div className='absolute -top-1 -left-1 w-12 h-12 border-l-4 border-t-4 border-yellow-400'></div>
					<div className='absolute -top-1 -right-1 w-12 h-12 border-r-4 border-t-4 border-yellow-400'></div>
					<div className='absolute -bottom-1 -left-1 w-12 h-12 border-l-4 border-b-4 border-yellow-400'></div>
					<div className='absolute -bottom-1 -right-1 w-12 h-12 border-r-4 border-b-4 border-yellow-400'></div>

					{/* Inner decorative frame */}
					<div className='absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-yellow-400/60'></div>
					<div className='absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-yellow-400/60'></div>
					<div className='absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-yellow-400/60'></div>
					<div className='absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-yellow-400/60'></div>

					{/* Sophisticated cocktail emblem */}
					<div className='mb-8 relative'>
						<div className='text-7xl sm:text-8xl lg:text-9xl text-yellow-400 mb-4 filter drop-shadow-lg'>
							🥃
						</div>
						<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-yellow-400/30 rotate-45'></div>
					</div>

					{/* Enhanced main headline with luxury typography */}
					<h1 className='text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-extralight text-white mb-8 leading-none tracking-[0.2em] uppercase'>
						<span className='block mb-3 text-shadow-lg'>
							Bartenders
						</span>
						<span className='text-yellow-400 font-thin tracking-[0.3em] filter drop-shadow-md'>
							Hub
						</span>
					</h1>

					{/* Elegant decorative separator with Art Deco pattern */}
					<div className='flex items-center justify-center mb-8'>
						<div className='w-20 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
						<div className='flex items-center mx-6'>
							<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-2'></div>
							<div className='w-4 h-4 border border-yellow-400 rotate-45 mx-2'></div>
							<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-2'></div>
						</div>
						<div className='w-20 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
					</div>

					{/* Enhanced rotating quotes with sophisticated styling */}
					<div className='mb-8 h-16 flex items-center justify-center'>
						<p className='text-xl sm:text-2xl lg:text-3xl text-gray-300 font-light italic tracking-wider transition-all duration-1000 max-w-4xl leading-relaxed'>
							<span className='text-yellow-400 text-2xl'>"</span>
							{speakeasyQuotes[currentQuote]}
							<span className='text-yellow-400 text-2xl'>"</span>
						</p>
					</div>
				</div>

				{/* Enhanced subtitle with better spacing */}
				<div className='mb-16 max-w-4xl mx-auto'>
					<p className='text-lg sm:text-xl lg:text-2xl text-gray-400 leading-relaxed font-light tracking-wide'>
						Step into the golden age of cocktails. Where master
						mixologists craft liquid poetry and every drink is a
						work of art. Welcome to the most exclusive bartending
						experience.
					</p>

					{/* Subtitle decorative element */}
					<div className='mt-8 flex items-center justify-center'>
						<div className='w-16 h-0.5 bg-yellow-400/50'></div>
						<div className='w-2 h-2 border border-yellow-400/50 rotate-45 mx-4'></div>
						<div className='w-16 h-0.5 bg-yellow-400/50'></div>
					</div>
				</div>

				{/* Enhanced Art Deco styled CTA Buttons */}
				<div className='flex flex-col sm:flex-row gap-8 justify-center items-center mb-20'>
					<button className='group relative w-full sm:w-auto bg-yellow-400 text-black font-light py-5 px-12 border-2 border-yellow-400 transition-all duration-700 hover:bg-black hover:text-yellow-400 tracking-[0.2em] uppercase text-sm shadow-2xl'>
						{/* Enhanced Art Deco corners */}
						<div className='absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-400'></div>
						<div className='absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-400'></div>
						<div className='absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-400'></div>
						<div className='absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-400'></div>

						{/* Inner decorative elements */}
						<div className='absolute top-1 left-1 w-2 h-2 border-l border-t border-black group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute top-1 right-1 w-2 h-2 border-r border-t border-black group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute bottom-1 left-1 w-2 h-2 border-l border-b border-black group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute bottom-1 right-1 w-2 h-2 border-r border-b border-black group-hover:border-yellow-400 transition-colors duration-700'></div>

						<span className='relative z-10 flex items-center gap-3'>
							<span>Explore Collection</span>
							<span className='text-lg group-hover:translate-x-1 transition-transform duration-300'>
								→
							</span>
						</span>
					</button>

					<button className='group relative w-full sm:w-auto bg-transparent text-yellow-400 font-light py-5 px-12 border-2 border-yellow-400/60 transition-all duration-700 hover:border-yellow-400 hover:bg-yellow-400/10 hover:shadow-2xl tracking-[0.2em] uppercase text-sm'>
						{/* Enhanced Art Deco corners */}
						<div className='absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-400/60 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-400/60 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-400/60 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-400/60 group-hover:border-yellow-400 transition-colors duration-700'></div>

						{/* Inner decorative elements */}
						<div className='absolute top-1 left-1 w-2 h-2 border-l border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute top-1 right-1 w-2 h-2 border-r border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute bottom-1 left-1 w-2 h-2 border-l border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-700'></div>
						<div className='absolute bottom-1 right-1 w-2 h-2 border-r border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-700'></div>

						<span className='relative z-10 flex items-center gap-3'>
							<span>Join the Elite</span>
							<span className='text-lg group-hover:scale-110 transition-transform duration-300'>
								⭐
							</span>
						</span>
					</button>
				</div>

				{/* Enhanced dynamic feature showcase */}
				<div className='relative mb-16'>
					{/* Rotating featured highlight */}
					<div className='bg-black/40 border-2 border-yellow-400/40 p-8 max-w-2xl mx-auto mb-12 backdrop-blur-sm'>
						{/* Art Deco corners for feature box */}
						<div className='absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-yellow-400'></div>
						<div className='absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-yellow-400'></div>
						<div className='absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-yellow-400'></div>
						<div className='absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-yellow-400'></div>

						<div className='text-center transition-all duration-1000'>
							<div className='text-5xl mb-4 filter drop-shadow-lg'>
								{premiumFeatures[currentFeature].icon}
							</div>
							<h3 className='text-yellow-400 font-light mb-3 text-xl tracking-[0.15em] uppercase'>
								{premiumFeatures[currentFeature].title}
							</h3>
							<p className='text-gray-400 text-base font-light leading-relaxed'>
								{premiumFeatures[currentFeature].desc}
							</p>
						</div>
					</div>

					{/* Feature grid - static premium elements */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
						{[
							{
								icon: '�',
								title: 'Award Winning',
								desc: 'Recognition from top industry experts',
							},
							{
								icon: '📚',
								title: 'Comprehensive Guide',
								desc: 'Complete cocktail knowledge base',
							},
							{
								icon: '🌍',
								title: 'Global Network',
								desc: 'Connect with bartenders worldwide',
							},
						].map((feature, index) => (
							<div
								key={index}
								className='group relative bg-black/30 border border-yellow-400/25 p-8 transition-all duration-700 hover:border-yellow-400/70 hover:bg-black/50 hover:shadow-2xl hover:-translate-y-2'
							>
								{/* Enhanced Art Deco corners */}
								<div className='absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-700'></div>
								<div className='absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-700'></div>
								<div className='absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-700'></div>
								<div className='absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-700'></div>

								{/* Inner frame */}
								<div className='absolute top-2 left-2 w-3 h-3 border-l border-t border-yellow-400/20 group-hover:border-yellow-400/60 transition-colors duration-700'></div>
								<div className='absolute top-2 right-2 w-3 h-3 border-r border-t border-yellow-400/20 group-hover:border-yellow-400/60 transition-colors duration-700'></div>
								<div className='absolute bottom-2 left-2 w-3 h-3 border-l border-b border-yellow-400/20 group-hover:border-yellow-400/60 transition-colors duration-700'></div>
								<div className='absolute bottom-2 right-2 w-3 h-3 border-r border-b border-yellow-400/20 group-hover:border-yellow-400/60 transition-colors duration-700'></div>

								<div className='text-center relative z-10'>
									<div className='text-4xl mb-6 group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg'>
										{feature.icon}
									</div>
									<h3 className='text-yellow-400 font-light mb-4 text-lg tracking-[0.1em] uppercase'>
										{feature.title}
									</h3>
									<p className='text-gray-400 text-sm font-light leading-relaxed'>
										{feature.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Enhanced bottom decorative element */}
				<div className='mt-20'>
					{/* Sophisticated divider pattern */}
					<div className='flex items-center justify-center mb-8'>
						<div className='w-24 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
						<div className='flex items-center mx-8'>
							<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-2'></div>
							<div className='text-yellow-400 text-xs uppercase tracking-[0.3em] font-light mx-4'>
								Est. 2025
							</div>
							<div className='w-2 h-2 border border-yellow-400 rotate-45 bg-yellow-400 mx-2'></div>
						</div>
						<div className='w-24 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
					</div>

					{/* Premium tagline */}
					<div className='text-center'>
						<p className='text-gray-500 text-sm font-light tracking-[0.2em] uppercase mb-4'>
							Crafted with Excellence • Served with Passion •
							Experienced with Pride
						</p>

						{/* Final decorative element */}
						<div className='flex items-center justify-center'>
							<div className='w-3 h-3 border border-yellow-400/50 rotate-45 mx-2'></div>
							<div className='w-6 h-0.5 bg-yellow-400/50'></div>
							<div className='w-1 h-1 bg-yellow-400 rounded-full mx-3'></div>
							<div className='w-6 h-0.5 bg-yellow-400/50'></div>
							<div className='w-3 h-3 border border-yellow-400/50 rotate-45 mx-2'></div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
