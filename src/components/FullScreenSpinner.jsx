import LoadingSpinner from './LoadingSpinner';

/**
 * Centers a LoadingSpinner full screen on gradient background.
 * Non-intrusive replacement for repeated inline markup.
 */
const FullScreenSpinner = ({ text = 'Loading...', size = 'medium' }) => {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black'>
			<LoadingSpinner text={text} size={size} />
		</div>
	);
};

export default FullScreenSpinner;
