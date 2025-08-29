import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const PRINCIPLES = [
	{
		icon: '🎨',
		title: 'Craft',
		detail: 'Measured technique. Respect for classics. Deliberate balance.',
	},
	{
		icon: '💎',
		title: 'Quality',
		detail: 'Thoughtful sourcing over quantity. Simplicity with intent.',
	},
	{
		icon: '🔬',
		title: 'R&D',
		detail: 'Iterative refinement; flavor structure over gimmicks.',
	},
	{
		icon: '🤝',
		title: 'Community',
		detail: 'Open knowledge exchange that raises the collective bar.',
	},
];

const ROADMAP = [
	{
		tag: '2025',
		phase: 'Foundation',
		text: 'Core recipe model & initial curated set.',
	},
	{
		tag: 'Q2',
		phase: 'Refinement',
		text: 'Improved tagging, media pipeline & quality signals.',
	},
	{
		tag: 'Q3',
		phase: 'Engagement',
		text: 'Progressive contributor capabilities & verification.',
	},
	{
		tag: 'Next',
		phase: 'Expansion',
		text: 'Structured technique guides & educational modules.',
	},
];

// A cleaner, calmer About section with progressive disclosure
const AboutSection = () => {
	const [expanded, setExpanded] = useState(false);
	const principles = useMemo(() => PRINCIPLES, []);
	const roadmap = useMemo(() => ROADMAP, []);

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
						A focused platform for precise recipes, technique
						annotation and respectful innovation in modern mixology.
					</p>
				</header>

				{/* Story */}
				<section className='max-w-4xl mx-auto mb-24'>
					<h2 className='sr-only'>Origin</h2>
					<div className='prose prose-invert prose-sm md:prose-base max-w-none prose-headings:tracking-wide'>
						<p>
							BartendersHub was founded to reduce noise and
							surface substance—distilling the craft into clear,
							reference‑grade entries.
						</p>
						{expanded && (
							<>
								<p>
									We emphasize ingredient clarity, proportion
									logic and repeatable process. Iteration is
									documented so refinement is visible and
									transferable.
								</p>
								<p>
									Capabilities grow with trust: verified
									contributors unlock extended tooling while
									casual learners still gain value. The result
									is a pathway from curiosity to disciplined
									practice.
								</p>
							</>
						)}
					</div>
					<button
						onClick={() => setExpanded((v) => !v)}
						className='mt-6 inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-yellow-400/80 hover:text-yellow-300 border border-yellow-400/30 hover:border-yellow-400 px-4 py-2 transition'
					>
						{expanded ? 'Collapse' : 'Read More'}
					</button>
				</section>

				{/* Principles */}
				<section className='mb-24'>
					<h2 className='text-center text-xl md:text-2xl font-light tracking-wide text-yellow-400 mb-12'>
						Core Principles
					</h2>
					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
						{principles.map((p) => (
							<article
								key={p.title}
								className='group rounded-lg border border-yellow-400/15 bg-neutral-900/40 p-6 backdrop-blur-sm transition hover:border-yellow-400/40'
							>
								<div className='mb-4 text-2xl' aria-hidden>
									{p.icon}
								</div>
								<h3 className='mb-2 text-sm font-semibold tracking-wide text-yellow-300 uppercase'>
									{p.title}
								</h3>
								<p className='text-xs leading-relaxed text-gray-400'>
									{p.detail}
								</p>
							</article>
						))}
					</div>
				</section>

				{/* Timeline */}
				<section className='mb-24'>
					<h2 className='text-center text-xl md:text-2xl font-light tracking-wide text-yellow-400 mb-12'>
						Progression
					</h2>
					<ol className='relative border-l border-yellow-400/20 ml-2 md:ml-4 space-y-10'>
						{roadmap.map((item) => (
							<li key={item.tag} className='pl-6 relative'>
								<span className='absolute -left-[10px] top-1 w-4 h-4 rounded-full border border-yellow-400/60 bg-black'></span>
								<div className='flex items-center gap-3 mb-1'>
									<span className='text-yellow-300 text-xs font-medium tracking-widest uppercase'>
										{item.tag}
									</span>
									<span className='text-[11px] uppercase tracking-wider text-gray-500'>
										{item.phase}
									</span>
								</div>
								<p className='text-xs md:text-sm text-gray-400 leading-relaxed max-w-prose'>
									{item.text}
								</p>
							</li>
						))}
					</ol>
				</section>

				{/* Metrics (concise) */}
				<section className='mb-24'>
					<h2 className='sr-only'>Snapshot</h2>
					<div className='flex flex-wrap justify-center gap-10 text-center'>
						<div>
							<div className='text-lg font-medium text-yellow-300 tracking-wide'>
								Curated
							</div>
							<div className='text-[11px] uppercase tracking-widest text-gray-500'>
								Recipe Library
							</div>
						</div>
						<div>
							<div className='text-lg font-medium text-yellow-300 tracking-wide'>
								Growing
							</div>
							<div className='text-[11px] uppercase tracking-widest text-gray-500'>
								Contributor Base
							</div>
						</div>
						<div>
							<div className='text-lg font-medium text-yellow-300 tracking-wide'>
								Structured
							</div>
							<div className='text-[11px] uppercase tracking-widest text-gray-500'>
								Technique Docs
							</div>
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className='text-center'>
					<h2 className='text-2xl md:text-3xl font-light tracking-wide text-white mb-6'>
						Contribute & Refine
					</h2>
					<p className='mx-auto mb-10 max-w-xl text-sm md:text-base leading-relaxed text-gray-400'>
						Help shape a practical, signal‑rich resource. Share
						rigorously tested recipes, improvement notes, or
						technique clarifications.
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
