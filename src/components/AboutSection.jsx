import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

// Content data (kept lean & scannable)
const VALUES = [
	{
		icon: '🧪',
		title: 'Evidence',
		text: 'Repeatable ratios & technique notes.',
	},
	{
		icon: '�',
		title: 'Curation',
		text: 'Signal over volume. Fewer, better recipes.',
	},
	{
		icon: '🤝',
		title: 'Sharing',
		text: 'Open learning path from novice to contributor.',
	},
	{
		icon: '🛠️',
		title: 'Iteration',
		text: 'Transparent improvements logged over time.',
	},
];

const STACK = [
	'Node',
	'Express',
	'MongoDB',
	'React 19',
	'React Query',
	'Tailwind',
	'Vite',
];

const MILESTONES = [
	{ tag: 'Now', text: 'Stable recipe core & auth foundation.' },
	{ tag: 'Next', text: 'Stronger media handling & moderation signals.' },
	{
		tag: 'Soon',
		text: 'Progressive contributor tooling & verification depth.',
	},
];

const AboutSection = () => {
	const [more, setMore] = useState(false);
	const values = useMemo(() => VALUES, []);
	const milestones = useMemo(() => MILESTONES, []);
	const stack = useMemo(() => STACK, []);

	return (
		<section className='relative overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black text-gray-300'>
			{/* Ambient background accents */}
			<div className='pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]'>
				<div className='absolute -top-32 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full bg-[conic-gradient(at_50%_50%,rgba(234,179,8,0.08),transparent_55%)] blur-3xl' />
			</div>
			<div className='relative mx-auto max-w-6xl px-6 pt-28 pb-32'>
				{/* Hero */}
				<header className='text-center mb-24'>
					<img
						src={logo}
						alt='BartendersHub logo'
						className='h-16 mx-auto mb-8 opacity-90 drop-shadow'
					/>
					<h1 className='text-3xl md:text-5xl font-light tracking-wide text-white mb-6'>
						Cocktail Knowledge, Distilled
					</h1>
					<p className='max-w-2xl mx-auto text-base md:text-lg font-light text-gray-400 leading-relaxed'>
						Practical, reference‑quality recipes and technique
						notes. Minimal distraction. Built for bartenders &
						curious makers.
					</p>
				</header>

				{/* Intro */}
				<section className='max-w-3xl mx-auto mb-24'>
					<h2 className='sr-only'>Mission</h2>
					<p className='text-sm md:text-base leading-relaxed text-gray-400'>
						We focus on clarity: ingredient intent, proportion logic
						and repeatable process.{' '}
						{more &&
							'Depth is added incrementally so newcomers are not overwhelmed while experienced bartenders still gain nuance.'}
					</p>
					<button
						onClick={() => setMore((v) => !v)}
						className='mt-5 text-[11px] tracking-widest uppercase text-yellow-400/80 hover:text-yellow-300 border border-yellow-400/30 hover:border-yellow-400 px-4 py-2 transition'
					>
						{more ? 'Show Less' : 'Read More'}
					</button>
				</section>

				{/* Values */}
				<section className='mb-28'>
					<h2 className='text-center text-xl md:text-2xl font-light tracking-wide text-yellow-400 mb-12'>
						Guiding Values
					</h2>
					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
						{values.map((v) => (
							<div
								key={v.title}
								className='group rounded-lg border border-yellow-400/15 bg-neutral-900/40 p-5 backdrop-blur-sm transition hover:border-yellow-400/40'
							>
								<div className='mb-3 text-2xl' aria-hidden>
									{v.icon}
								</div>
								<h3 className='mb-1 text-xs font-semibold tracking-wider text-yellow-300 uppercase'>
									{v.title}
								</h3>
								<p className='text-[11px] leading-relaxed text-gray-400'>
									{v.text}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Milestones + Stack */}
				<div className='grid gap-20 lg:grid-cols-2 mb-32'>
					<section>
						<h2 className='text-xl md:text-2xl font-light tracking-wide text-yellow-400 mb-8'>
							Direction
						</h2>
						<ul className='space-y-6'>
							{milestones.map((m) => (
								<li
									key={m.tag}
									className='flex gap-4 items-start'
								>
									<span className='mt-0.5 text-[10px] font-medium tracking-widest text-yellow-300 uppercase bg-yellow-400/10 border border-yellow-400/30 px-2 py-1 rounded'>
										{m.tag}
									</span>
									<p className='text-sm text-gray-400 leading-relaxed'>
										{m.text}
									</p>
								</li>
							))}
						</ul>
					</section>
					<section>
						<h2 className='text-xl md:text-2xl font-light tracking-wide text-yellow-400 mb-8'>
							Stack
						</h2>
						<div className='flex flex-wrap gap-3'>
							{stack.map((s) => (
								<span
									key={s}
									className='text-[11px] tracking-widest uppercase bg-neutral-900/60 border border-yellow-400/25 text-yellow-300/90 px-3 py-2 rounded'
								>
									{s}
								</span>
							))}
						</div>
					</section>
				</div>

				{/* CTA */}
				<section className='text-center'>
					<h2 className='text-2xl md:text-3xl font-light tracking-wide text-white mb-6'>
						Help Refine The Library
					</h2>
					<p className='mx-auto mb-10 max-w-xl text-sm md:text-base leading-relaxed text-gray-400'>
						Share rigorously tested recipes or technique
						improvements. Every clear contribution raises the
						baseline.
					</p>
					<div className='flex flex-col sm:flex-row justify-center gap-4'>
						<Link
							to='/cocktails'
							className='px-7 py-3 text-[11px] tracking-widest uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition font-medium'
						>
							Browse Library
						</Link>
						<Link
							to='/login?mode=register'
							className='px-7 py-3 text-[11px] tracking-widest uppercase border border-yellow-400/60 text-yellow-300 hover:border-yellow-400 hover:bg-yellow-400/10 transition'
						>
							Create Account
						</Link>
					</div>
					<p className='mt-14 text-[10px] tracking-[0.35em] text-gray-600 uppercase'>
						Est. 2025 • Precision Over Hype
					</p>
				</section>
			</div>
		</section>
	);
};

export default AboutSection;
