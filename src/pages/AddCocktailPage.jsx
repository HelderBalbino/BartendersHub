import AddCocktailSection from '../components/AddCocktailSection';
import ErrorBoundary from '../components/ErrorBoundary';

const AddCocktailPage = () => {
	return (
		<ErrorBoundary>
			<AddCocktailSection />
		</ErrorBoundary>
	);
};

export default AddCocktailPage;
