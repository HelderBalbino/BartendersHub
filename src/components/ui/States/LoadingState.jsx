import PropTypes from 'prop-types';
import ArtDecoLoader from '../ArtDeco/ArtDecoLoader';
import GradientPage from '../../../components/GradientPage';

const LoadingState = ({
	size = 'medium',
	text = 'Loading...',
	emoji = '🍸',
	fullScreen = false,
	className = '',
}) => {
	if (fullScreen)
		return (
			<GradientPage center full className={className}>
				<ArtDecoLoader size={size} text={text} emoji={emoji} />
			</GradientPage>
		);
	return (
		<div className={`flex justify-center py-20 ${className}`}>
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
