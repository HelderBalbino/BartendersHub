const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
	const getSizeClasses = () => {
		switch (size) {
			case 'small':
				return 'w-6 h-6';
			case 'large':
				return 'w-12 h-12';
			default:
				return 'w-8 h-8';
		}
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-[200px]'>
			<div
				className={`${getSizeClasses()} border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mb-4`}
			></div>
			<p className='text-gray-400 text-sm font-light tracking-wide uppercase'>
				{text}
			</p>
		</div>
	);
};

export default LoadingSpinner;
