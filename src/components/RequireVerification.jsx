import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

/*
 * Wrap interactive UI that should only work for verified users.
 * Renders children normally if verified; otherwise wraps them in a disabled button / span that triggers a toast.
 * Props:
 *  - children: element or function
 *  - reason: string describing the gated action (e.g. "like this cocktail")
 *  - inline: if true, renders inline element instead of block
 *  - onRedirectIntent: optional callback to store intended redirect path or state
 */
const RequireVerification = ({
	children,
	reason = 'perform this action',
	inline = false,
	intent = 'generic',
	onRedirectIntent,
}) => {
	const { user, isAuthenticated } = useAuth();
	const isVerified = Boolean(user?.isVerified);

	if (isAuthenticated && isVerified) {
		return typeof children === 'function' ? children() : children;
	}

	const handleClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isAuthenticated) {
			toast((t) => (
				<span>
					Please log in to {reason}.&nbsp;
					<a
						href={`/login?mode=login&redirect=${encodeURIComponent(
							window.location.pathname + window.location.search,
						)}&intent=${encodeURIComponent(intent)}`}
						className='underline text-yellow-400'
						onClick={() => toast.dismiss(t.id)}
					>
						Log in
					</a>
				</span>
			));
			if (onRedirectIntent) onRedirectIntent(intent);
			return;
		}

		if (isAuthenticated && !isVerified) {
			toast((t) => (
				<span>
					Verify your email to {reason}.&nbsp;
					<a
						href={`/verify-pending?redirect=${encodeURIComponent(
							window.location.pathname + window.location.search,
						)}&intent=${encodeURIComponent(intent)}`}
						className='underline text-yellow-400'
						onClick={() => toast.dismiss(t.id)}
					>
						Verify now
					</a>
				</span>
			));
			if (onRedirectIntent) onRedirectIntent(intent);
		}
	};

	// Use a button for better semantics if child is not already an interactive element.
	// We render a wrapper that is still focusable so keyboard users get feedback.
	const WrapperTag = inline ? 'span' : 'div';

	return (
		<WrapperTag
			role='button'
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					handleClick(e);
				}
			}}
			className={`relative group ${
				inline ? 'inline-block' : ''
			} cursor-not-allowed opacity-60 select-none outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70 rounded`}
			aria-disabled='true'
			aria-label={`Verification required to ${reason}`}
			title={`Verification required to ${reason}`}
			data-requires-verification='true'
		>
			{typeof children === 'function'
				? children({ disabled: true })
				: children}
			<span className='pointer-events-none absolute inset-0 rounded bg-transparent group-hover:bg-black/20 transition-colors' />
		</WrapperTag>
	);
};

RequireVerification.propTypes = {
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
	reason: PropTypes.string,
	inline: PropTypes.bool,
	intent: PropTypes.string,
	onRedirectIntent: PropTypes.func,
};

export default RequireVerification;
