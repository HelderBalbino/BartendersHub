const SkeletonGrid = ({ count = 6 }) => {
	const items = Array.from({ length: count });
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse'>
			{items.map((_, i) => (
				<div
					key={i}
					className='bg-gray-800/50 rounded border border-yellow-500/10 p-4 space-y-3'
				>
					<div className='h-40 w-full bg-gray-700/60 rounded'></div>
					<div className='h-4 w-3/4 bg-gray-700/60 rounded'></div>
					<div className='h-3 w-1/2 bg-gray-700/50 rounded'></div>
				</div>
			))}
		</div>
	);
};

export default SkeletonGrid;
