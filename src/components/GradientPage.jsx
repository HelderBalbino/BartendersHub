/**
 * Generic gradient page/section wrapper consolidating repeated classes.
 * Props:
 *  - full (boolean) -> min-h-screen
 *  - center (boolean) -> flex center
 *  - overflow (string) -> overflow handling (default 'hidden')
 *  - padding (string) -> padding classes (default 'py-16')
 *  - className (string) -> additional classes
 */
const GradientPage = ({
	children,
	full = true,
	center = false,
	padding = 'py-16',
	overflow = 'overflow-hidden',
	className = '',
}) => {
	const height = full ? 'min-h-screen' : '';
	const centerCls = center ? 'flex items-center justify-center' : '';
	return (
		<section
			className={`relative bg-gradient-to-br from-black via-gray-900 to-black ${height} ${centerCls} ${overflow} ${padding} ${className}`}
		>
			{children}
		</section>
	);
};

export default GradientPage;
