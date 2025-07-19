import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

const StepsList = ({
	steps,
	onChange,
	placeholder = 'Step',
	minSteps = 1,
	className = '',
}) => {
	const handleStepChange = (index, value) => {
		const newSteps = [...steps];
		newSteps[index] = value;
		onChange(newSteps);
	};

	const addStep = () => {
		onChange([...steps, '']);
	};

	const removeStep = (index) => {
		if (steps.length <= minSteps) {
			toast.error(`You must have at least ${minSteps} step`);
			return;
		}

		const newSteps = steps.filter((_, i) => i !== index);
		onChange(newSteps);
	};

	return (
		<div className={className}>
			{steps.map((step, index) => (
				<div key={index} className='flex gap-2 mb-3'>
					<div className='flex-shrink-0 w-8 h-12 flex items-center justify-center border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-sm font-bold'>
						{index + 1}
					</div>
					<textarea
						value={step}
						onChange={(e) =>
							handleStepChange(index, e.target.value)
						}
						rows={2}
						className='flex-1 bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500 resize-none'
						placeholder={`${placeholder} ${index + 1}`}
					/>
					{steps.length > minSteps && (
						<button
							type='button'
							onClick={() => removeStep(index)}
							className='text-red-400 hover:text-red-300 px-3 py-2 border border-red-400/30 hover:border-red-400 transition-colors duration-300'
						>
							×
						</button>
					)}
				</div>
			))}
			<button
				type='button'
				onClick={addStep}
				className='text-yellow-400 hover:text-yellow-300 text-sm font-light tracking-wide uppercase'
			>
				+ Add Step
			</button>
		</div>
	);
};

StepsList.propTypes = {
	steps: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	minSteps: PropTypes.number,
	className: PropTypes.string,
};

export default StepsList;
