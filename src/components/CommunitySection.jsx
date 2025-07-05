import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CommunitySection = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [activeFilter, setActiveFilter] = useState('all');
	const [currentFeatured, setCurrentFeatured] = useState(0);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	// Mock community data - replace with real data from your backend
	const communityMembers = [
		{
			id: 1,
			name: 'Helder Balbino',
			username: 'helder_bartender',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
			cocktailsAdded: 47,
			joinDate: '2024-12-15',
			isVerified: true,
			speciality: 'Classic Cocktails',
			location: 'London, UK',
			badges: ['Master Mixologist', 'Classic Expert'],
			recentActivity: 'Added "Negroni Sbagliato" 2 hours ago',
		},
		{
			id: 2,
			name: 'Giacomo',
			username: 'cocktail_queen',
			avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
			cocktailsAdded: 89,
			joinDate: '2024-11-20',
			isVerified: true,
			speciality: 'Molecular Mixology',
			location: 'London, UK',
			badges: ['Innovation Leader', 'Top Contributor'],
			recentActivity: 'Created "Smoky Whisper" 1 day ago',
		},
		{
			id: 3,
			name: 'Luca',
			username: 'bartender_luca',
			avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
			cocktailsAdded: 34,
			joinDate: '2025-01-05',
			isVerified: false,
			speciality: 'Classic Cocktails',
			location: 'London, UK',
			badges: ['Rising Star'],
			recentActivity: 'Added "Paradise Punch" 3 hours ago',
		},
		{
			id: 4,
			name: 'Giorgia',
			username: 'italian_giorgia',
			avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
			cocktailsAdded: 62,
			joinDate: '2024-10-12',
			isVerified: true,
			speciality: 'French Classics',
			location: 'london, UK',
			badges: ['European Expert', 'Heritage Keeper'],
			recentActivity: 'Perfected "French 75 Royale" 4 hours ago',
		},
		{
			id: 5,
			name: 'Matteu',
			username: 'tequila_diego',
			avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
			cocktailsAdded: 56,
			joinDate: '2024-09-30',
			isVerified: true,
			speciality: 'Agave Spirits',
			location: 'london, UK',
			badges: ['Agave Specialist', 'Cultural Ambassador'],
			recentActivity: 'Shared "Mezcal Dreams" 6 hours ago',
		},
		{
			id: 6,
			name: 'Emma Craft',
			username: 'craft_emma',
			avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
			cocktailsAdded: 23,
			joinDate: '2025-01-10',
			isVerified: false,
			speciality: 'Craft Cocktails',
			location: 'London, UK',
			badges: ['New Talent'],
			recentActivity: 'Added "Garden Gimlet" 1 day ago',
		},
		{
			id: 7,
			name: 'Hiroshi Sato',
			username: 'sake_master',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
			cocktailsAdded: 71,
			joinDate: '2024-08-15',
			isVerified: true,
			speciality: 'Japanese Cocktails',
			location: 'Tokyo, Japan',
			badges: ['Eastern Wisdom', 'Sake Specialist'],
			recentActivity: 'Created "Sakura Sour" 8 hours ago',
		},
		{
			id: 8,
			name: 'Olivia',
			username: 'rum_runner_olivia',
			avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
			cocktailsAdded: 45,
			joinDate: '2024-12-01',
			isVerified: true,
			speciality: 'Caribbean Cocktails',
			location: 'Havana, Cuba',
			badges: ['Caribbean Queen', 'Rum Expert'],
			recentActivity: 'Added "Havana Nights" 12 hours ago',
		},
	];

	const featuredMembers = communityMembers
		.filter((member) => member.isVerified)
		.slice(0, 3);

	const filters = [
		{ key: 'all', label: 'All Members', count: communityMembers.length },
		{
			key: 'verified',
			label: 'Verified',
			count: communityMembers.filter((m) => m.isVerified).length,
		},
		{
			key: 'top',
			label: 'Top Contributors',
			count: communityMembers.filter((m) => m.cocktailsAdded > 50).length,
		},
		{
			key: 'new',
			label: 'New Members',
			count: communityMembers.filter(
				(m) => new Date(m.joinDate) > new Date('2025-04-04'),
			).length,
		},
	];

	const getFilteredMembers = () => {
		switch (activeFilter) {
			case 'verified':
				return communityMembers.filter((m) => m.isVerified);
			case 'top':
				return communityMembers
					.filter((m) => m.cocktailsAdded > 50)
					.sort((a, b) => b.cocktailsAdded - a.cocktailsAdded);
			case 'new':
				return communityMembers
					.filter(
						(m) => new Date(m.joinDate) > new Date('2025-01-01'),
					)
					.sort(
						(a, b) => new Date(b.joinDate) - new Date(a.joinDate),
					);
			default:
				return communityMembers.sort(
					(a, b) => b.cocktailsAdded - a.cocktailsAdded,
				);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentFeatured((prev) => (prev + 1) % featuredMembers.length);
		}, 4000);
		return () => clearInterval(interval);
	}, [featuredMembers.length]);

	return (
		<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden py-16 md:py-20'>
			{/* Art Deco Background Pattern */}
			<div className='absolute inset-0 opacity-5'>
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/10 to-transparent'></div>
				<div className='absolute top-8 left-8 w-24 h-24 md:w-32 md:h-32 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-8 right-8 w-20 h-20 md:w-28 md:h-28 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/2 left-1/4 w-16 h-16 md:w-24 md:h-24 border border-yellow-400/15 rotate-45'></div>
				<div className='absolute top-1/4 right-1/3 w-18 h-18 md:w-20 md:h-20 border border-yellow-400/15 rotate-45'></div>
			</div>

			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Header Section */}
				<div
					className={`text-center mb-12 md:mb-16 transition-all duration-1500 ${
						isVisible
							? 'opacity-100 translate-y-0'
							: 'opacity-0 translate-y-10'
					}`}
				>
					{/* Decorative Header */}
					<div className='mb-8 md:mb-12'>
						<div className='w-24 md:w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-4'></div>
						<div className='flex items-center justify-center gap-3 md:gap-4 mb-4'>
							<div className='w-2 h-2 md:w-3 md:h-3 border border-yellow-400 rotate-45 bg-yellow-400'></div>
							<div className='text-yellow-400 text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] font-light'>
								Great Community
							</div>
							<div className='w-2 h-2 md:w-3 md:h-3 border border-yellow-400 rotate-45 bg-yellow-400'></div>
						</div>
						<div className='w-16 md:w-24 h-0.5 bg-yellow-400 mx-auto'></div>
					</div>

					<h1 className='text-3xl md:text-4xl lg:text-5xl font-extralight text-white mb-6 leading-tight tracking-[0.1em] uppercase'>
						Master{' '}
						<span className='text-yellow-400 font-thin'>
							Mixologists
						</span>
					</h1>

					<p className='text-lg md:text-xl text-gray-300 font-light italic leading-relaxed max-w-3xl mx-auto mb-8'>
						"Meet the passionate artisans who craft liquid poetry
						and share their expertise with our community."
					</p>

					{/* Community Stats */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12'>
						{[
							{
								number: communityMembers.length,
								label: 'Members',
								icon: '👥',
							},
							{
								number: communityMembers.reduce(
									(sum, m) => sum + m.cocktailsAdded,
									0,
								),
								label: 'Cocktails',
								icon: '🍸',
							},
							{
								number: communityMembers.filter(
									(m) => m.isVerified,
								).length,
								label: 'Verified',
								icon: '✅',
							},
							{ number: '50+', label: 'Countries', icon: '🌍' },
						].map((stat, index) => (
							<div
								key={index}
								className='bg-black/30 border border-yellow-400/30 p-4 md:p-6 backdrop-blur-sm'
							>
								<div className='text-2xl md:text-3xl mb-2'>
									{stat.icon}
								</div>
								<div className='text-xl md:text-2xl font-light text-yellow-400 mb-1'>
									{stat.number}
								</div>
								<div className='text-xs md:text-sm text-gray-400 font-light uppercase tracking-wide'>
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Featured Member Spotlight */}
				<div className='mb-12 md:mb-16'>
					<div className='text-center mb-8'>
						<h2 className='text-2xl md:text-3xl font-light text-yellow-400 tracking-[0.15em] uppercase mb-4'>
							Featured Mixologist
						</h2>
						<div className='flex items-center justify-center'>
							<div className='w-16 md:w-24 h-0.5 bg-yellow-400/50'></div>
							<div className='w-2 h-2 border border-yellow-400/50 rotate-45 mx-4'></div>
							<div className='w-16 md:w-24 h-0.5 bg-yellow-400/50'></div>
						</div>
					</div>

					{featuredMembers.length > 0 && (
						<div className='relative border border-yellow-400/40 p-8 md:p-12 bg-black/20 backdrop-blur-sm max-w-4xl mx-auto'>
							{/* Art Deco corners */}
							<div className='absolute -top-1 -left-1 w-8 md:w-12 h-8 md:h-12 border-l-2 border-t-2 md:border-l-4 md:border-t-4 border-yellow-400'></div>
							<div className='absolute -top-1 -right-1 w-8 md:w-12 h-8 md:h-12 border-r-2 border-t-2 md:border-r-4 md:border-t-4 border-yellow-400'></div>
							<div className='absolute -bottom-1 -left-1 w-8 md:w-12 h-8 md:h-12 border-l-2 border-b-2 md:border-l-4 md:border-b-4 border-yellow-400'></div>
							<div className='absolute -bottom-1 -right-1 w-8 md:w-12 h-8 md:h-12 border-r-2 border-b-2 md:border-r-4 md:border-b-4 border-yellow-400'></div>

							<div className='flex flex-col md:flex-row items-center gap-6 md:gap-8 transition-all duration-1000'>
								<div className='relative'>
									<img
										src={
											featuredMembers[currentFeatured]
												.avatar
										}
										alt={
											featuredMembers[currentFeatured]
												.name
										}
										className='w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-yellow-400/60 object-cover'
									/>
									{featuredMembers[currentFeatured]
										.isVerified && (
										<div className='absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-black'>
											<span className='text-black text-sm font-bold'>
												✓
											</span>
										</div>
									)}
								</div>

								<div className='flex-1 text-center md:text-left'>
									<h3 className='text-2xl md:text-3xl font-light text-white mb-2'>
										{featuredMembers[currentFeatured].name}
									</h3>
									<p className='text-yellow-400 text-lg mb-3'>
										@
										{
											featuredMembers[currentFeatured]
												.username
										}
									</p>
									<p className='text-gray-300 mb-3'>
										{
											featuredMembers[currentFeatured]
												.speciality
										}
									</p>
									<p className='text-gray-400 text-sm mb-4'>
										{
											featuredMembers[currentFeatured]
												.location
										}
									</p>

									<div className='flex flex-wrap justify-center md:justify-start gap-2 mb-4'>
										{featuredMembers[
											currentFeatured
										].badges.map((badge, index) => (
											<span
												key={index}
												className='bg-yellow-400/20 text-yellow-400 px-3 py-1 text-xs uppercase tracking-wide border border-yellow-400/40'
											>
												{badge}
											</span>
										))}
									</div>

									<div className='flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start'>
										<div className='flex items-center gap-4'>
											<div className='text-center'>
												<div className='text-2xl font-light text-yellow-400'>
													{
														featuredMembers[
															currentFeatured
														].cocktailsAdded
													}
												</div>
												<div className='text-xs text-gray-400 uppercase tracking-wide'>
													Cocktails
												</div>
											</div>
											<div className='w-px h-8 bg-yellow-400/30'></div>
											<div className='text-center'>
												<div className='text-sm text-gray-300'>
													{
														featuredMembers[
															currentFeatured
														].recentActivity
													}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Filter Tabs */}
				<div className='mb-8 md:mb-12'>
					<div className='flex flex-wrap justify-center gap-2 md:gap-4'>
						{filters.map((filter) => (
							<button
								key={filter.key}
								onClick={() => setActiveFilter(filter.key)}
								className={`group relative px-4 md:px-6 py-2 md:py-3 border transition-all duration-300 tracking-[0.1em] uppercase text-xs md:text-sm font-light ${
									activeFilter === filter.key
										? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
										: 'border-yellow-400/30 text-gray-300 hover:border-yellow-400/60 hover:text-yellow-400'
								}`}
							>
								{/* Small Art Deco corners for active filter */}
								{activeFilter === filter.key && (
									<>
										<div className='absolute top-0 left-0 w-2 h-2 border-l border-t border-yellow-400'></div>
										<div className='absolute top-0 right-0 w-2 h-2 border-r border-t border-yellow-400'></div>
										<div className='absolute bottom-0 left-0 w-2 h-2 border-l border-b border-yellow-400'></div>
										<div className='absolute bottom-0 right-0 w-2 h-2 border-r border-b border-yellow-400'></div>
									</>
								)}

								<span className='relative z-10'>
									{filter.label}{' '}
									<span className='text-yellow-400/70'>
										({filter.count})
									</span>
								</span>
							</button>
						))}
					</div>
				</div>

				{/* Members Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
					{getFilteredMembers().map((member) => (
						<div
							key={member.id}
							className='group relative bg-black/30 border border-yellow-400/30 p-6 backdrop-blur-sm transition-all duration-500 hover:border-yellow-400/60 hover:bg-yellow-400/5 hover:scale-105'
						>
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
								<h3 className='text-white font-light text-lg mb-1 group-hover:text-yellow-400 transition-colors duration-300'>
									{member.name}
								</h3>
								<p className='text-yellow-400/70 text-sm mb-3'>
									@{member.username}
								</p>
								<p className='text-gray-400 text-xs mb-3'>
									{member.speciality}
								</p>
								<p className='text-gray-500 text-xs mb-4'>
									{member.location}
								</p>

								{/* Cocktails Count */}
								<div className='mb-4'>
									<div className='flex items-center justify-center gap-2 mb-2'>
										<span className='text-2xl'>🍸</span>
										<span className='text-xl font-light text-yellow-400'>
											{member.cocktailsAdded}
										</span>
									</div>
									<div className='text-xs text-gray-400 uppercase tracking-wide'>
										Cocktails Added
									</div>
								</div>

								{/* Badges */}
								<div className='flex flex-wrap justify-center gap-1 mb-4'>
									{member.badges
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
								<div className='text-xs text-gray-500 italic'>
									{member.recentActivity}
								</div>

								{/* View Profile Button */}
								<button className='mt-4 w-full bg-transparent border border-yellow-400/40 text-yellow-400 py-2 px-4 text-xs uppercase tracking-wide transition-all duration-300 hover:bg-yellow-400/10 hover:border-yellow-400'>
									View Profile
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Join Community CTA */}
				<div className='text-center mt-16 md:mt-20'>
					<div className='relative border border-yellow-400/40 p-8 md:p-12 bg-black/20 backdrop-blur-sm max-w-3xl mx-auto'>
						{/* Art Deco corners */}
						<div className='absolute -top-1 -left-1 w-6 md:w-8 h-6 md:h-8 border-l-2 border-t-2 border-yellow-400'></div>
						<div className='absolute -top-1 -right-1 w-6 md:w-8 h-6 md:h-8 border-r-2 border-t-2 border-yellow-400'></div>
						<div className='absolute -bottom-1 -left-1 w-6 md:w-8 h-6 md:h-8 border-l-2 border-b-2 border-yellow-400'></div>
						<div className='absolute -bottom-1 -right-1 w-6 md:w-8 h-6 md:h-8 border-r-2 border-b-2 border-yellow-400'></div>

						<h2 className='text-2xl md:text-3xl font-light text-white tracking-[0.15em] uppercase mb-6'>
							Join the Hub
						</h2>
						<p className='text-lg md:text-xl text-gray-300 font-light italic mb-8 leading-relaxed'>
							"Share your passion, learn, and become part of the
							greatest mixology community."
						</p>

						<div className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center'>
							<Link
								to='/login'
								className='group relative bg-yellow-400 text-black font-light py-3 md:py-4 px-8 md:px-10 border-2 border-yellow-400 transition-all duration-500 hover:bg-black hover:text-yellow-400 tracking-[0.1em] uppercase text-sm block text-center'
							>
								{/* Art Deco corners */}
								<div className='absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-yellow-400'></div>
								<div className='absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-yellow-400'></div>
								<div className='absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-yellow-400'></div>
								<div className='absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-yellow-400'></div>

								<span className='relative z-10'>
									Join the Hub
								</span>
							</Link>

							<button className='group relative bg-transparent text-yellow-400 font-light py-3 md:py-4 px-8 md:px-10 border-2 border-yellow-400/60 transition-all duration-500 hover:border-yellow-400 hover:bg-yellow-400/10 tracking-[0.1em] uppercase text-sm'>
								<span className='relative z-10'>
									Share a Cocktail
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CommunitySection;
