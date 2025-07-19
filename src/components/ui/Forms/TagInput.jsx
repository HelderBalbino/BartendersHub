import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

const TagInput = ({
	items,
	onChange,
	placeholder = 'Add item',
	fieldName = 'items',
	minItems = 1,
	className = '',
}) => {
	const handleItemChange = (index, value) => {
		const newItems = [...items];
		newItems[index] = value;
		onChange(newItems);
	};

	const addItem = () => {
		onChange([...items, '']);
	};

	const removeItem = (index) => {
		if (items.length <= minItems) {
			toast.error(
				`You must have at least ${minItems} ${fieldName.slice(0, -1)}`,
			);
			return;
		}

		const newItems = items.filter((_, i) => i !== index);
		onChange(newItems);
	};

	return (
		<div className={className}>
			{items.map((item, index) => (
				<div key={index} className='flex gap-2 mb-3'>
					<input
						type='text'
						value={item}
						onChange={(e) =>
							handleItemChange(index, e.target.value)
						}
						className='flex-1 bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500'
						placeholder={`${placeholder} ${index + 1}`}
					/>
					{items.length > minItems && (
						<button
							type='button'
							onClick={() => removeItem(index)}
							className='text-red-400 hover:text-red-300 px-3 py-2 border border-red-400/30 hover:border-red-400 transition-colors duration-300'
						>
							×
						</button>
					)}
				</div>
			))}
			<button
				type='button'
				onClick={addItem}
				className='text-yellow-400 hover:text-yellow-300 text-sm font-light tracking-wide uppercase'
			>
				+ Add {fieldName.slice(0, -1)}
			</button>
		</div>
	);
};

TagInput.propTypes = {
	items: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	fieldName: PropTypes.string,
	minItems: PropTypes.number,
	className: PropTypes.string,
};

export default TagInput;
