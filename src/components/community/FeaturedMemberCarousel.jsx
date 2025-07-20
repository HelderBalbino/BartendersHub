import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const FeaturedMemberCarousel = ({ featuredMembers }) => {
	const [currentFeatured, setCurrentFeatured] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentFeatured((prev) => (prev + 1) % featuredMembers.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [featuredMembers.length]);

	if (!featuredMembers || featuredMembers.length === 0) {
		return null;
	}

	return (
		<div className='relative border border-yellow-400/30 p-6 md:p-8 bg-black/20 backdrop-blur-sm mb-16 md:mb-20 overflow-hidden'>
			{/* Background pattern overlay */}
			<div
				className='absolute inset-0 opacity-[0.03]'
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='1'%3E%3Cpath d='M20 20c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10zm10-10c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
				}}
			></div>

			{/* Art Deco corners */}
			<div className='absolute -top-1 -left-1 w-6 md:w-8 h-6 md:h-8 border-l-2 border-t-2 border-yellow-400'></div>
			<div className='absolute -top-1 -right-1 w-6 md:w-8 h-6 md:h-8 border-r-2 border-t-2 border-yellow-400'></div>
			<div className='absolute -bottom-1 -left-1 w-6 md:w-8 h-6 md:h-8 border-l-2 border-b-2 border-yellow-400'></div>
			<div className='absolute -bottom-1 -right-1 w-6 md:w-8 h-6 md:h-8 border-r-2 border-b-2 border-yellow-400'></div>

			<div className='relative z-10'>
				<div className='text-center mb-6 md:mb-8'>
					<div className='inline-block relative'>
						{/* Art Deco decoration */}
						<div className='absolute left-1/2 transform -translate-x-1/2 -top-4 w-20 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent'></div>
						<h2 className='text-xl md:text-2xl font-light text-yellow-400 tracking-[0.2em] uppercase mb-2'>
							Featured Member
						</h2>
						<div className='absolute left-1/2 transform -translate-x-1/2 -bottom-4 w-20 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent'></div>
					</div>
				</div>

				{/* Carousel Indicators */}
				<div className='flex justify-center gap-2 mb-6 md:mb-8'>
					{featuredMembers.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentFeatured(index)}
							className={`w-2 h-2 border transition-all duration-300 ${
								currentFeatured === index
									? 'border-yellow-400 bg-yellow-400'
									: 'border-yellow-400/40 hover:border-yellow-400/70'
							}`}
						></button>
					))}
				</div>

				{/* Featured Member Spotlight */}
				<div className='text-center'>
					{featuredMembers.map(
						(member, index) =>
							currentFeatured === index && (
								<div
									key={member.id}
									className='flex flex-col md:flex-row items-center gap-6 md:gap-8'
								>
									{/* Avatar with Art Deco frame */}
									<div className='relative flex-shrink-0'>
										<div className='relative p-1 border border-yellow-400/60 bg-gradient-to-r from-yellow-400/20 to-yellow-400/10'>
											<img
												src={member.avatar}
												alt={member.name}
												className='w-24 h-24 md:w-32 md:h-32 object-cover'
											/>
										</div>
										{/* Art Deco frame corners */}
										<div className='absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-400'></div>
										<div className='absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-yellow-400'></div>
										<div className='absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-yellow-400'></div>
										<div className='absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-400'></div>
									</div>

									{/* Member Details */}
									<div className='flex-1 text-center md:text-left'>
										<h3 className='text-2xl md:text-3xl font-light text-white mb-2 tracking-[0.1em]'>
											{member.name}
										</h3>
										<p className='text-yellow-400 text-lg mb-2 italic'>
											@{member.username}
										</p>
										<p className='text-gray-300 mb-3'>
											{member.speciality}
										</p>
										<p className='text-gray-400 text-sm mb-4'>
											{member.location}
										</p>

										<div className='flex flex-wrap justify-center md:justify-start gap-2 mb-4'>
											{member.badges.map(
												(badge, index) => (
													<span
														key={index}
														className='bg-yellow-400/20 text-yellow-400 px-3 py-1 text-xs uppercase tracking-wide border border-yellow-400/40'
													>
														{badge}
													</span>
												),
											)}
										</div>

										<div className='flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start'>
											<div className='flex items-center gap-4'>
												<div className='text-center'>
													<div className='text-2xl font-light text-yellow-400'>
														{member.cocktailsAdded}
													</div>
													<div className='text-xs text-gray-400 uppercase tracking-wide'>
														Cocktails
													</div>
												</div>
												<div className='w-px h-8 bg-yellow-400/30'></div>
												<div className='text-center'>
													<div className='text-sm text-gray-300'>
														{member.recentActivity}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							),
					)}
				</div>
			</div>
		</div>
	);
};

FeaturedMemberCarousel.propTypes = {
	featuredMembers: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
			username: PropTypes.string.isRequired,
			avatar: PropTypes.string.isRequired,
			speciality: PropTypes.string.isRequired,
			location: PropTypes.string.isRequired,
			badges: PropTypes.arrayOf(PropTypes.string).isRequired,
			cocktailsAdded: PropTypes.number.isRequired,
			recentActivity: PropTypes.string.isRequired,
		}),
	).isRequired,
};

export default FeaturedMemberCarousel;
