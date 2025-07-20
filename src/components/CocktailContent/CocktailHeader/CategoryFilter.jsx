import PropTypes from 'prop-types';
import FilterTabs from '../../ui/Navigation/FilterTabs';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
	return (
		<FilterTabs
			filters={categories}
			activeFilter={activeCategory}
			onChange={onCategoryChange}
		/>
	);
};

CategoryFilter.propTypes = {
	categories: PropTypes.array.isRequired,
	activeCategory: PropTypes.string.isRequired,
	onCategoryChange: PropTypes.func.isRequired,
};

export default CategoryFilter;
