import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

// A cleaner, calmer About section with progressive disclosure
const AboutSection = () => {
	const [expanded, setExpanded] = useState(false);

	const coreValues = [
		{
			icon: '🎨',
			title: 'Craft',
			text: 'Respecting classic techniques while showcasing refined balance in every pour.',
		},
		{
			icon: '💎',
			title: 'Quality',
			text: 'Sourcing premium ingredients & elevating presentation without excess.',
		},
		{
			icon: '�',
			title: 'Innovation',
			text: 'Modern riffs and thoughtful experimentation—never novelty for its own sake.',
		},
		{
			icon: '🤝',
			title: 'Community',
			text: 'A welcoming space where enthusiasts and professionals learn & share.',
		},
	];

	return (
		<section className='relative bg-gradient-to-br from-black via-gray-900 to-black text-gray-300'>
			{/* Subtle backdrop */}
			<div className='pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,rgba(234,179,8,0.18),transparent_60%)]'></div>
			<div className='relative mx-auto max-w-6xl px-5 py-24 md:py-28'>
				{/* Hero */}
				<header className='flex flex-col items-center text-center mb-20'>
					<img
						src={logo}
						alt='BartendersHub'
						className='h-16 w-auto mb-6 drop-shadow-md opacity-90'
					/>
					<h1 className='text-3xl md:text-5xl font-light tracking-wide text-white mb-6'>
						Refined Cocktail Culture
					</h1>
					<p className='max-w-2xl text-base md:text-lg font-light text-gray-400 leading-relaxed'>
						Showcasing timeless recipes, thoughtful innovation & the
						craft behind great hospitality.
					</p>
				</header>

				{/* Story (collapsed) */}
				<section className='max-w-4xl mx-auto mb-20'>
					<div className='space-y-5 text-sm md:text-base leading-relaxed tracking-wide'>
						<p>
							BartendersHub began with a simple intention: curate
							the elegance of classic cocktail culture while
							giving modern creators a respectful stage.
						</p>
						{expanded && (
							<>
								<p>
									We embrace proportion, balance and
									restraint—celebrating quiet excellence over
									spectacle. Our community blends seasoned
									professionals and curious newcomers united
									by appreciation for detail.
								</p>
								<p>
									More than a recipe archive, the Hub is a
									living notebook: technique notes, ingredient
									nuances and iterative refinement. We believe
									sharing process elevates the craft for
									everyone.
								</p>
							</>
						)}
					</div>
					<button
						onClick={() => setExpanded((v) => !v)}
						className='mt-6 text-xs tracking-widest uppercase text-yellow-400/80 hover:text-yellow-300 transition border border-yellow-400/30 hover:border-yellow-400 px-4 py-2 backdrop-blur-sm'
					>
						{expanded ? 'Show Less' : 'Read More'}
					</button>
				</section>

				{/* Values */}
				<section className='mb-24'>
					<h2 className='text-center text-xl md:text-2xl tracking-wide text-yellow-400 font-light mb-10'>
						Core Principles
					</h2>
					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
						{coreValues.map((v) => (
							<div
								key={v.title}
								className='group relative rounded-md border border-yellow-400/20 bg-black/30 p-6 backdrop-blur-sm transition hover:border-yellow-400/50'
							>
								<div className='mb-4 text-3xl'>{v.icon}</div>
								<h3 className='mb-2 font-light tracking-wide text-yellow-300'>
									{v.title}
								</h3>
								<p className='text-xs leading-relaxed text-gray-400'>
									{v.text}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Compact Metrics */}
				<section className='mb-24'>
					<ul className='flex flex-wrap items-center justify-center gap-8 text-center text-sm tracking-wider'>
						<li className='flex flex-col gap-1'>
							<span className='text-yellow-400 text-xl'>
								2025
							</span>
							<span className='text-gray-500 uppercase'>
								Founded
							</span>
						</li>
						<li className='flex flex-col gap-1'>
							<span className='text-yellow-400 text-xl'>
								Growing
							</span>
							<span className='text-gray-500 uppercase'>
								Community
							</span>
						</li>
						<li className='flex flex-col gap-1'>
							<span className='text-yellow-400 text-xl'>
								Curated
							</span>
							<span className='text-gray-500 uppercase'>
								Library
							</span>
						</li>
					</ul>
				</section>

				{/* CTA */}
				<section className='text-center'>
					<h2 className='text-2xl md:text-3xl font-light tracking-wide text-white mb-6'>
						Join the Hub
					</h2>
					<p className='mx-auto mb-10 max-w-xl text-sm md:text-base leading-relaxed text-gray-400'>
						Contribute recipes, refine technique notes & help shape
						an understated yet passionate cocktail resource.
					</p>
					<div className='flex flex-col sm:flex-row justify-center gap-4'>
						<Link
							to='/cocktails'
							className='px-6 py-3 text-xs tracking-widest uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition font-medium'
						>
							Explore Cocktails
						</Link>
						<Link
							to='/login?mode=register'
							className='px-6 py-3 text-xs tracking-widest uppercase border border-yellow-400/60 text-yellow-300 hover:border-yellow-400 hover:bg-yellow-400/10 transition'
						>
							Create Account
						</Link>
					</div>
					<p className='mt-12 text-[10px] tracking-[0.3em] text-gray-600 uppercase'>
						Est. 2025 • Crafted, Not Crowded
					</p>
				</section>
			</div>
		</section>
	);
};

export default AboutSection;
