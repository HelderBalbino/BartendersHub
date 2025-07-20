import PropTypes from 'prop-types';
import TagInput from '../../ui/Forms/TagInput';
import FormSection from '../../ui/Forms/FormSection';

const IngredientsForm = ({ ingredients, onChange, error, touched }) => {
	return (
		<FormSection title='Ingredients'>
			<TagInput
				items={ingredients}
				onChange={onChange}
				placeholder='Ingredient'
				fieldName='ingredients'
				minItems={1}
			/>
			{touched && error && (
				<p className='mt-1 text-red-400 text-xs'>{error}</p>
			)}
		</FormSection>
	);
};

IngredientsForm.propTypes = {
	ingredients: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	error: PropTypes.string,
	touched: PropTypes.bool,
};

export default IngredientsForm;
