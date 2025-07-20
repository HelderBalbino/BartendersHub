import PropTypes from 'prop-types';
import CocktailCard from '../../CocktailCard';

const CocktailGrid = ({ cocktails, onCardClick, columns = 3 }) => {
	const gridClasses = {
		1: 'grid-cols-1',
		2: 'grid-cols-1 md:grid-cols-2',
		3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
	};

	if (cocktails.length === 0) return null;

	return (
		<div className={`grid ${gridClasses[columns]} gap-6`}>
			{cocktails.map((cocktail) => (
				<CocktailCard
					key={cocktail._id || cocktail.id}
					cocktailData={{
						id: cocktail._id || cocktail.id,
						name: cocktail.name,
						image: cocktail.image || cocktail.imageUrl,
						imageAlt: `${cocktail.name} cocktail`,
						difficulty: cocktail.difficulty,
						prepTime: cocktail.prepTime,
						description: cocktail.description,
						rating: cocktail.rating || 4.5,
					}}
					onCardClick={onCardClick}
					size='medium'
				/>
			))}
		</div>
	);
};

CocktailGrid.propTypes = {
	cocktails: PropTypes.array.isRequired,
	onCardClick: PropTypes.func.isRequired,
	columns: PropTypes.oneOf([1, 2, 3, 4]),
};

export default CocktailGrid;
