import { useState, useEffect } from 'react';
import { useCommunityMembers } from '../hooks/useCommunity';
import useCommunityRealtime from '../hooks/useCommunityRealtime';
import LoadingSpinner from './LoadingSpinner';
import FeaturedMemberCarousel from './community/FeaturedMemberCarousel';
import MemberFilters from './community/MemberFilters';
import MembersGrid from './community/MembersGrid';
import CommunityStats from './community/CommunityStats';
import JoinCommunityCTA from './community/JoinCommunityCTA';
import NewMemberNotifications from './community/NewMemberNotifications';

const CommunitySection = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [activeFilter, setActiveFilter] = useState('all');

	const {
		data: communityData,
		isLoading,
		error,
	} = useCommunityMembers({
		filter: activeFilter,
		limit: 20,
	});

	useEffect(() => {
		setIsVisible(true);
	}, []);

	// Extract members from API response
	const initialMembers = communityData?.users || [];

	// Real-time community updates
	const {
		members: realtimeMembers,
		recentJoins,
		isConnected,
		clearRecentJoin,
	} = useCommunityRealtime(initialMembers);

	// Use real-time members instead of static data
	const communityMembers = realtimeMembers;
	const featuredMembers = communityMembers
		.filter((member) => member.isVerified)
		.slice(0, 3);

	// Show loading state
	if (isLoading) {
		return (
			<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
				<LoadingSpinner />
			</section>
		);
	}

	// Show error state
	if (error) {
		return (
			<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
				<div className='text-center text-white'>
					<h2 className='text-2xl mb-4'>Unable to load community</h2>
					<p className='text-gray-400'>Please try again later</p>
				</div>
			</section>
		);
	}

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

	return (
		<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden py-16 md:py-20'>
			{/* Real-time New Member Notifications */}
			<NewMemberNotifications
				recentJoins={recentJoins}
				onClearJoin={clearRecentJoin}
			/>

			{/* Connection Status Indicator (optional debug info) */}
			{import.meta.env.DEV && (
				<div
					className={`fixed bottom-4 left-4 z-40 px-3 py-1 rounded-full text-xs font-medium ${
						isConnected
							? 'bg-green-500/20 text-green-400 border border-green-500/30'
							: 'bg-red-500/20 text-red-400 border border-red-500/30'
					}`}
				>
					{isConnected ? '🟢 Live Updates' : '🔴 Offline'}
				</div>
			)}
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
					<CommunityStats
						stats={[
							{
								value: communityMembers.length,
								label: 'Members',
							},
							{
								value: communityMembers.reduce(
									(sum, m) => sum + m.cocktailsAdded,
									0,
								),
								label: 'Cocktails',
							},
							{
								value: communityMembers.filter(
									(m) => m.isVerified,
								).length,
								label: 'Verified',
							},
							{ value: '50+', label: 'Countries' },
						]}
					/>
				</div>

				{/* Featured Member Spotlight */}
				<FeaturedMemberCarousel featuredMembers={featuredMembers} />

				{/* Member Filters */}
				<MemberFilters
					filters={filters}
					activeFilter={activeFilter}
					onFilterChange={setActiveFilter}
				/>

				{/* Members Grid */}
				<MembersGrid members={getFilteredMembers()} />

				{/* Join Community CTA */}
				<JoinCommunityCTA />
			</div>
		</section>
	);
};

export default CommunitySection;
