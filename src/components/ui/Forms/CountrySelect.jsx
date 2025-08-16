import { useState, useEffect, useRef } from 'react';
import countries, { findCountry } from '../../../utils/countries';

// Accessible typeahead country selector storing ISO code value
const CountrySelect = ({
	value,
	onChange,
	onBlur,
	error,
	touched,
	required,
}) => {
	const [query, setQuery] = useState('');
	const [open, setOpen] = useState(false);
	const [highlight, setHighlight] = useState(0);
	const listRef = useRef(null);

	// Sync query with current value label
	useEffect(() => {
		if (!open) {
			const c = findCountry(value);
			setQuery(c ? c.name : '');
		}
	}, [value, open]);

	const filtered = query
		? countries.filter(
				(c) =>
					c.name.toLowerCase().includes(query.toLowerCase()) ||
					c.code.toLowerCase() === query.toLowerCase(),
		  )
		: countries;

	useEffect(() => {
		if (highlight >= filtered.length) setHighlight(0);
	}, [filtered, highlight]);

	const selectCountry = (code) => {
		onChange({ target: { name: 'country', value: code } });
		setOpen(false);
	};

	const handleKeyDown = (e) => {
		if (!open && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
			setOpen(true);
			return;
		}
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setHighlight((h) => Math.min(filtered.length - 1, h + 1));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setHighlight((h) => Math.max(0, h - 1));
				break;
			case 'Enter':
				if (open && filtered[highlight]) {
					e.preventDefault();
					selectCountry(filtered[highlight].code);
				}
				break;
			case 'Escape':
				setOpen(false);
				break;
		}
	};

	return (
		<div className='relative'>
			<input
				type='text'
				role='combobox'
				aria-expanded={open}
				aria-controls='country-listbox'
				aria-autocomplete='list'
				name='countrySearch'
				value={query}
				onChange={(e) => {
					setQuery(e.target.value);
					setOpen(true);
				}}
				onFocus={() => setOpen(true)}
				onBlur={() => {
					// Delay closing to allow click selection
					setTimeout(() => setOpen(false), 150);
					onBlur?.({ target: { name: 'country', value } });
				}}
				onKeyDown={handleKeyDown}
				placeholder='Start typing your country'
				className={`w-full bg-black/20 border ${
					touched && error ? 'border-red-400' : 'border-yellow-400/30'
				} text-white caret-white px-4 py-3 pr-10 focus:border-yellow-400 focus:outline-none transition-colors duration-300 font-normal`}
				required={required}
				autoComplete='off'
			/>
			<input type='hidden' name='country' value={value} />
			<div className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-yellow-400'>
				⌄
			</div>
			{open && (
				<ul
					id='country-listbox'
					role='listbox'
					ref={listRef}
					className='absolute z-20 mt-1 max-h-60 w-full overflow-auto bg-black/90 border border-yellow-400/30 shadow-lg backdrop-blur-sm'
				>
					{filtered.length === 0 && (
						<li className='px-3 py-2 text-gray-400 text-sm'>
							No matches
						</li>
					)}
					{filtered.map((c, idx) => (
						<li
							key={c.code}
							role='option'
							aria-selected={value === c.code}
							className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-sm ${
								idx === highlight
									? 'bg-yellow-400/20'
									: 'hover:bg-yellow-400/10'
							} ${
								value === c.code
									? 'text-yellow-300'
									: 'text-gray-200'
							}`}
							onMouseEnter={() => setHighlight(idx)}
							onMouseDown={(e) => {
								e.preventDefault();
								selectCountry(c.code);
							}}
						>
							<span>{c.flag}</span>
							<span className='flex-1'>{c.name}</span>
							<span className='text-xs opacity-60'>{c.code}</span>
						</li>
					))}
				</ul>
			)}
			{touched && error && (
				<p className='mt-1 text-red-400 text-xs'>{error}</p>
			)}
		</div>
	);
};

export default CountrySelect;
