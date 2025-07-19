import PropTypes from 'prop-types';
import ArtDecoLoader from '../ArtDeco/ArtDecoLoader';

const LoadingState = ({
	size = 'medium',
	text = 'Loading...',
	emoji = '🍸',
	fullScreen = false,
	className = '',
}) => {
	const containerClasses = fullScreen
		? 'relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'
		: 'flex justify-center py-20';

	return (
		<div className={`${containerClasses} ${className}`}>
			<ArtDecoLoader size={size} text={text} emoji={emoji} />
		</div>
	);
};

LoadingState.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	text: PropTypes.string,
	emoji: PropTypes.string,
	fullScreen: PropTypes.bool,
	className: PropTypes.string,
};

export default LoadingState;
