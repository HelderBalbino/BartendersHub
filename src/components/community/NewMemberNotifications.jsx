import { useState, useEffect, useRef, useCallback } from 'react';

const NewMemberNotification = ({ member, onClose }) => {
	const [visible, setVisible] = useState(false);
	const timeoutRef = useRef();

	const handleClose = useCallback(() => {
		setVisible(false);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setTimeout(onClose, 180);
	}, [onClose]);

	useEffect(() => {
		const showId = setTimeout(() => setVisible(true), 30);
		const autoId = setTimeout(() => handleClose(), 4000);
		timeoutRef.current = autoId;
		return () => {
			clearTimeout(showId);
			clearTimeout(autoId);
		};
	}, [handleClose]);

	return (
		<div
			className={`pointer-events-auto flex items-start gap-3 rounded-md border border-yellow-400/30 bg-black/70 backdrop-blur px-4 py-3 shadow-lg ring-1 ring-black/40 text-yellow-300 text-sm transition-all duration-200 will-change-transform ${
				visible
					? 'opacity-100 translate-y-0'
					: 'opacity-0 -translate-y-2'
			}`}
		>
			<div className='flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400/10 text-base'>
				🥂
			</div>
			<div className='pr-6'>
				<p className='font-medium tracking-wide text-yellow-200'>
					New Member
				</p>
				<p className='text-xs text-gray-300 mt-0.5'>
					@{member.username || member.name}
				</p>
			</div>
			<button
				onClick={handleClose}
				className='absolute top-1.5 right-2 text-yellow-400/70 hover:text-yellow-200 transition-colors text-xs'
				aria-label='Dismiss'
			>
				✕
			</button>
		</div>
	);
};

const NewMemberNotifications = ({ recentJoins, onClearJoin }) => (
	<div className='fixed top-4 right-4 z-50 flex flex-col gap-2 w-[280px]'>
		{recentJoins.map((member) => (
			<NewMemberNotification
				key={member.id}
				member={member}
				onClose={() => onClearJoin(member.id)}
			/>
		))}
	</div>
);

export default NewMemberNotifications;
