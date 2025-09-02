// DEPRECATED: This wrapper was redundant. Keep export temporarily to avoid breaking imports.
// Switch existing imports to use FilterTabs directly then remove this file.
import FilterTabs from '../../ui/Navigation/FilterTabs';
const CategoryFilter = (props) => (
	<FilterTabs
		filters={props.categories}
		activeFilter={props.activeCategory}
		onChange={props.onCategoryChange}
	/>
);
export default CategoryFilter;
