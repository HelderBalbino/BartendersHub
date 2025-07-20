import { useState, useEffect } from 'react';
import HeroBackground from './hero/HeroBackground';
import HeroHeader from './hero/HeroHeader';
import HeroContentFrame from './hero/HeroContentFrame';
import HeroSubtitle from './hero/HeroSubtitle';
import HeroButtons from './hero/HeroButtons';
import HeroFooter from './hero/HeroFooter';

const Hero = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [currentQuote, setCurrentQuote] = useState(0);

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

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentQuote((prev) => (prev + 1) % speakeasyQuotes.length);
		}, 4000);
		return () => clearInterval(interval);
	}, [speakeasyQuotes.length]);

	return (
		<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden py-8'>
			{/* Enhanced Art Deco Background Pattern - Mobile Optimized */}
			<HeroBackground />

			{/* Main content - Mobile-First Responsive Design */}
			<div
				className={`relative z-10 text-center px-4 sm:px-6 md:px-8 lg:px-8 max-w-7xl mx-auto transition-all duration-1500 ${
					isVisible
						? 'opacity-100 translate-y-0'
						: 'opacity-0 translate-y-10'
				}`}
			>
				{/* Enhanced top decorative section - Mobile optimized */}
				<HeroHeader />
				{/* Enhanced main frame with mobile-first styling */}
				<HeroContentFrame
					speakeasyQuotes={speakeasyQuotes}
					currentQuote={currentQuote}
				/>
				{/* Enhanced subtitle with better spacing - Mobile optimized */}
				{/* Enhanced subtitle with better spacing - Mobile optimized */}
				<HeroSubtitle />

				{/* Enhanced Art Deco styled CTA Buttons - Mobile Optimized */}
				<HeroButtons />

				{/* Enhanced bottom decorative element - Mobile optimized */}
				<HeroFooter />
			</div>
		</section>
	);
};

export default Hero;
