import PropTypes from 'prop-types';
import ArtDecoHeader from '../../ui/ArtDeco/ArtDecoHeader';

const SectionHeader = ({
	title = 'Premium Cocktail Collection',
	subtitle = 'Discover masterfully crafted cocktails from bartenders around the world',
	emoji = '🍸',
	size = 'large',
}) => {
	return (
		<ArtDecoHeader
			title={title}
			subtitle={subtitle}
			emoji={emoji}
			size={size}
		/>
	);
};

SectionHeader.propTypes = {
	title: PropTypes.string,
	subtitle: PropTypes.string,
	emoji: PropTypes.string,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default SectionHeader;
