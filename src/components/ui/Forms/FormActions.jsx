import PropTypes from 'prop-types';

const FormActions = ({ children, className = '', variant = 'default' }) => {
	const variantClasses = {
		default: 'flex justify-center',
		spread: 'flex justify-between',
		end: 'flex justify-end',
		start: 'flex justify-start',
	};

	return (
		<div className={`pt-8 ${variantClasses[variant]} ${className}`}>
			{children}
		</div>
	);
};

FormActions.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	variant: PropTypes.oneOf(['default', 'spread', 'end', 'start']),
};

export default FormActions;
