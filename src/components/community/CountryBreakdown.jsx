import React from 'react';

const CountryBreakdown = ({ members }) => {
	const counts = members.reduce((acc, m) => {
		const key = (m.country || m.location || 'Unknown').trim();
		if (!key) return acc;
		acc[key] = (acc[key] || 0) + 1;
		return acc;
	}, {});
	const entries = Object.entries(counts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 12);

	if (!entries.length) return null;

	const toFlag = (country) => {
		if (/^[A-Z]{2}$/i.test(country)) {
			return country
				.toUpperCase()
				.split('')
				.map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
				.join('');
		}
		return '🌍';
	};

	return (
		<div className='mt-12'>
			<h3 className='text-yellow-400 text-sm tracking-[0.25em] uppercase mb-4 text-center'>
				Global Presence
			</h3>
			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
				{entries.map(([country, count]) => (
					<div
						key={country}
						className='flex items-center gap-2 px-3 py-2 bg-black/30 border border-yellow-400/20 text-gray-200 text-sm hover:border-yellow-400/50 transition-colors'
					>
						<span className='text-lg'>{toFlag(country)}</span>
						<span className='truncate'>{country}</span>
						<span className='ml-auto text-yellow-400 font-light'>
							{count}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default CountryBreakdown;
