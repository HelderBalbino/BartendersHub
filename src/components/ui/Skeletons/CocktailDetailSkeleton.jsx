const CocktailDetailSkeleton = () => {
	return (
		<section className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-16 px-4 animate-pulse'>
			<div className='max-w-5xl mx-auto'>
				<div className='h-4 w-40 bg-yellow-500/20 mb-6'></div>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
					<div className='relative border border-yellow-500/30 p-4'>
						<div className='w-full h-96 bg-yellow-500/10'></div>
					</div>
					<div>
						<div className='h-10 w-2/3 bg-yellow-500/20 mb-6'></div>
						<div className='space-y-2 mb-8'>
							<div className='h-3 w-full bg-yellow-500/10'></div>
							<div className='h-3 w-5/6 bg-yellow-500/10'></div>
							<div className='h-3 w-4/6 bg-yellow-500/10'></div>
						</div>
						<div className='grid grid-cols-2 gap-6 mb-8'>
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className='space-y-2'>
									<div className='h-2 w-20 bg-yellow-500/20'></div>
									<div className='h-3 w-24 bg-yellow-500/10'></div>
								</div>
							))}
						</div>
						<div className='h-6 w-40 bg-yellow-500/20 mb-4'></div>
						<div className='space-y-2 mb-10'>
							{Array.from({ length: 5 }).map((_, i) => (
								<div
									key={i}
									className='h-3 w-full bg-yellow-500/10'
								></div>
							))}
						</div>
						<div className='flex gap-2'>
							{Array.from({ length: 3 }).map((_, i) => (
								<div
									key={i}
									className='h-6 w-16 bg-yellow-500/10 rounded'
								></div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CocktailDetailSkeleton;
