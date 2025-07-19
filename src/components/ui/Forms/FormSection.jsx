import PropTypes from 'prop-types';

const FormSection = ({
	title,
	children,
	className = '',
	variant = 'default',
}) => {
	const variantClasses = {
		default: 'space-y-6',
		compact: 'space-y-4',
		grid: 'grid grid-cols-2 gap-4',
	};

	return (
		<div className={`${variantClasses[variant]} ${className}`}>
			{title && (
				<div className='mb-6'>
					<h3 className='text-yellow-400 text-lg font-light tracking-wide uppercase mb-2'>
						{title}
					</h3>
					<div className='w-12 h-0.5 bg-yellow-400'></div>
				</div>
			)}
			{children}
		</div>
	);
};

FormSection.propTypes = {
	title: PropTypes.string,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	variant: PropTypes.oneOf(['default', 'compact', 'grid']),
};

export default FormSection;
