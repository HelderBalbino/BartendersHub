import PropTypes from 'prop-types';
import StepsList from '../../ui/Forms/StepsList';
import FormSection from '../../ui/Forms/FormSection';

const InstructionsForm = ({ instructions, onChange, error, touched }) => {
	return (
		<FormSection title='Instructions'>
			<StepsList
				steps={instructions}
				onChange={onChange}
				placeholder='Step'
				minSteps={1}
			/>
			{touched && error && (
				<p className='mt-1 text-red-400 text-xs'>{error}</p>
			)}
		</FormSection>
	);
};

InstructionsForm.propTypes = {
	instructions: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	error: PropTypes.string,
	touched: PropTypes.bool,
};

export default InstructionsForm;
