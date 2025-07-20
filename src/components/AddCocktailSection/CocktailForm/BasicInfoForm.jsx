import PropTypes from 'prop-types';
import FormField from '../../ui/Forms/FormField';
import FormSection from '../../ui/Forms/FormSection';

const BasicInfoForm = ({ values, errors, touched, onChange, onBlur }) => {
	return (
		<FormSection title='Basic Information'>
			<FormField
				label='Cocktail Name'
				name='name'
				value={values.name}
				onChange={onChange}
				onBlur={onBlur}
				placeholder='The Golden Fizz'
				required
				error={errors.name}
				touched={touched.name}
			/>

			<FormField
				label='Description'
				name='description'
				type='textarea'
				value={values.description}
				onChange={onChange}
				onBlur={onBlur}
				rows={4}
				placeholder='A sophisticated blend of gin and elderflower...'
				required
				error={errors.description}
				touched={touched.description}
			/>

			<FormSection variant='grid'>
				<FormField
					label='Difficulty'
					name='difficulty'
					type='select'
					value={values.difficulty}
					onChange={onChange}
				>
					<option value='beginner'>Beginner</option>
					<option value='intermediate'>Intermediate</option>
					<option value='advanced'>Advanced</option>
					<option value='expert'>Expert</option>
				</FormField>

				<FormField
					label='Prep Time'
					name='prepTime'
					value={values.prepTime}
					onChange={onChange}
					onBlur={onBlur}
					placeholder='5 min'
					required
					error={errors.prepTime}
					touched={touched.prepTime}
				/>

				<FormField
					label='Servings'
					name='servings'
					type='number'
					value={values.servings}
					onChange={onChange}
					min='1'
					max='20'
				/>

				<FormField
					label='Glass Type'
					name='glassType'
					value={values.glassType}
					onChange={onChange}
					onBlur={onBlur}
					placeholder='Martini Glass'
					required
					error={errors.glassType}
					touched={touched.glassType}
				/>
			</FormSection>

			<FormField
				label='Garnish'
				name='garnish'
				value={values.garnish}
				onChange={onChange}
				placeholder='Lemon twist, Cherry, Olive...'
			/>
		</FormSection>
	);
};

BasicInfoForm.propTypes = {
	values: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	touched: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
};

export default BasicInfoForm;
