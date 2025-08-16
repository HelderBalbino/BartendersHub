import React from 'react';
import { findCountry } from '../../utils/countries';

const CountryBreakdown = ({ members }) => {
	const counts = members.reduce((acc, m) => {
		let raw = (m.country || m.location || '').trim();
		if (!raw) return acc;
		// Normalize: if it's a full name convert to code for aggregation
		let code = '';
		if (/^[A-Z]{2}$/i.test(raw)) {
			code = raw.toUpperCase();
		} else {
			const found = findCountry(raw);
			code = found ? found.code : raw; // fallback: legacy value
		}
		acc[code] = (acc[code] || 0) + 1;
		return acc;
	}, {});

	const entries = Object.entries(counts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 12)
		.map(([code, count]) => {
			const c = findCountry(code);
			return {
				code,
				name: c ? c.name : code,
				flag: c && /^[A-Z]{2}$/i.test(code) ? c.flag : '🌍',
				count,
			};
		});

	if (!entries.length) return null;

	return (
		<div className='mt-12'>
			<h3 className='text-yellow-400 text-sm tracking-[0.25em] uppercase mb-4 text-center'>
				Global Presence
			</h3>
			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
				{entries.map((e) => (
					<div
						key={e.code}
						className='flex items-center gap-2 px-3 py-2 bg-black/30 border border-yellow-400/20 text-gray-200 text-sm hover:border-yellow-400/50 transition-colors'
					>
						<span className='text-lg'>{e.flag}</span>
						<span className='truncate'>{e.name}</span>
						<span className='ml-auto text-yellow-400 font-light'>
							{e.count}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default CountryBreakdown;
