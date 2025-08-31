import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Safely convert plain-text URLs into clickable links (no HTML injection)
function linkify(text) {
	if (!text || typeof text !== 'string') return text;
	const urlRegex = /(https?:\/\/[^\s)]+)|(www\.[^\s)]+)/gi;
	const parts = [];
	let lastIndex = 0;
	let match;
	while ((match = urlRegex.exec(text)) !== null) {
		const url = match[0];
		const start = match.index;
		if (start > lastIndex) {
			parts.push(text.slice(lastIndex, start));
		}
		let href = url;
		if (!href.startsWith('http')) href = 'https://' + href; // normalize
		parts.push(
			<a
				key={start + url}
				href={href}
				target='_blank'
				rel='noopener noreferrer'
				className='underline text-yellow-400 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60 break-all'
			>
				{url}
			</a>,
		);
		lastIndex = start + url.length;
	}
	if (lastIndex < text.length) parts.push(text.slice(lastIndex));
	return parts.length ? parts : text;
}

const MemberCard = ({ member }) => {
	const userId = member.id || member._id;

	return (
		<div className='group relative bg-black/30 border border-yellow-400/30 p-6 backdrop-blur-sm transition-all duration-500 hover:border-yellow-400/60 hover:bg-yellow-400/5 hover:scale-105'>
			{/* Small Art Deco corners */}
			<div className='absolute top-0 left-0 w-3 h-3 border-l border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
			<div className='absolute top-0 right-0 w-3 h-3 border-r border-t border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
			<div className='absolute bottom-0 left-0 w-3 h-3 border-l border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>
			<div className='absolute bottom-0 right-0 w-3 h-3 border-r border-b border-yellow-400/40 group-hover:border-yellow-400 transition-colors duration-500'></div>

			<div className='text-center'>
				{/* Avatar */}
				<div className='relative mb-4'>
					<img
						src={member.avatar}
						alt={member.name}
						loading='lazy'
						decoding='async'
						className='w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-yellow-400/40 group-hover:border-yellow-400 object-cover mx-auto transition-all duration-300'
					/>
					{member.isVerified && (
						<div className='absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border border-black'>
							<span className='text-black text-xs font-bold'>
								✓
							</span>
						</div>
					)}
				</div>

				{/* Member Info */}
				<Link to={`/profile/${userId}`} className='inline-block'>
					<h3 className='text-white font-light text-lg mb-1 group-hover:text-yellow-400 transition-colors duration-300 hover:text-yellow-400'>
						{member.name}
					</h3>
				</Link>
				<p className='text-yellow-400/70 text-sm mb-3'>
					@{member.username}
				</p>
				<p className='text-gray-400 text-xs mb-3'>
					{linkify(member.speciality)}
				</p>
				<p className='text-gray-500 text-xs mb-4'>
					{linkify(member.location)}
				</p>

				{/* Cocktails Count */}
				<div className='mb-4'>
					<div className='flex items-center justify-center gap-2 mb-2'>
						<span className='text-2xl'>🍸</span>
						<span className='text-xl font-light text-yellow-400'>
							{member.cocktailsAdded ||
								member.cocktailsCount ||
								0}
						</span>
					</div>
					<div className='text-xs text-gray-400 uppercase tracking-wide'>
						Cocktails Added
					</div>
				</div>

				{/* Badges */}
				<div className='flex flex-wrap justify-center gap-1 mb-4'>
					{(member.badges || [])
						.slice(0, 2)
						.map((badge, badgeIndex) => (
							<span
								key={badgeIndex}
								className='bg-yellow-400/20 text-yellow-400 px-2 py-1 text-xs rounded border border-yellow-400/40'
							>
								{badge}
							</span>
						))}
				</div>

				{/* Recent Activity */}
				<div className='text-xs text-gray-500 italic mb-4'>
					{linkify(
						member.recentActivity ||
							`Joined ${new Date(
								member.joinDate || member.createdAt,
							).toLocaleDateString()}`,
					)}
				</div>

				{/* View Profile Button */}
				<Link
					to={`/profile/${userId}`}
					className='block w-full bg-transparent border border-yellow-400/40 text-yellow-400 py-2 px-4 text-xs uppercase tracking-wide transition-all duration-300 hover:bg-yellow-400/10 hover:border-yellow-400 text-center'
				>
					View Profile
				</Link>
			</div>
		</div>
	);
};

const MembersGrid = ({ members }) => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
			{members.map((member) => (
				<MemberCard key={member.id} member={member} />
			))}
		</div>
	);
};

MemberCard.propTypes = {
	member: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		avatar: PropTypes.string.isRequired,
		speciality: PropTypes.string.isRequired,
		location: PropTypes.string.isRequired,
		cocktailsAdded: PropTypes.number.isRequired,
		badges: PropTypes.arrayOf(PropTypes.string).isRequired,
		recentActivity: PropTypes.string.isRequired,
		isVerified: PropTypes.bool,
	}).isRequired,
};

MembersGrid.propTypes = {
	members: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
			username: PropTypes.string.isRequired,
			avatar: PropTypes.string.isRequired,
			speciality: PropTypes.string.isRequired,
			location: PropTypes.string.isRequired,
			cocktailsAdded: PropTypes.number.isRequired,
			badges: PropTypes.arrayOf(PropTypes.string).isRequired,
			recentActivity: PropTypes.string.isRequired,
			isVerified: PropTypes.bool,
		}),
	).isRequired,
};

export default MembersGrid;
