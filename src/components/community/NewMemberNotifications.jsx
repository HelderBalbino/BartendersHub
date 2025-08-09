import { useState, useEffect } from 'react';

const NewMemberNotification = ({ member, onClose }) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Slide in animation
		setTimeout(() => setIsVisible(true), 100);
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(onClose, 300); // Wait for animation
	};

	return (
		<div
			className={`fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-4 rounded-lg shadow-2xl border border-yellow-300 transition-all duration-300 transform ${
				isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
			}`}
			style={{ minWidth: '300px' }}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
						<span className="text-lg">🎉</span>
					</div>
					<div>
						<p className="font-bold text-sm">New Member Joined!</p>
						<p className="text-sm opacity-90">
							Welcome <strong>{member.name}</strong>
						</p>
					</div>
				</div>
				<button
					onClick={handleClose}
					className="text-black hover:text-gray-700 transition-colors ml-2"
				>
					✕
				</button>
			</div>
		</div>
	);
};

const NewMemberNotifications = ({ recentJoins, onClearJoin }) => {
	return (
		<div className="fixed top-0 right-0 z-50 space-y-2 p-4">
			{recentJoins.map((member) => (
				<NewMemberNotification
					key={member.id}
					member={member}
					onClose={() => onClearJoin(member.id)}
				/>
			))}
		</div>
	);
};

export default NewMemberNotifications;
