import express from 'express';
import { body } from 'express-validator';
import {
	register,
	login,
	getMe,
	updateDetails,
	updatePassword,
	forgotPassword,
	resetPassword,
	verifyEmail,
	resendVerification,
	deleteAccount,
	getResendAttempts,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/errorHandler.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
	trackLoginAttempts,
	validatePasswordStrength,
} from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
	body('name')
		.notEmpty()
		.withMessage('Name is required')
		.isLength({ min: 2, max: 50 })
		.withMessage('Name must be between 2 and 50 characters'),
	body('email').isEmail().withMessage('Please provide a valid email'),
	body('password')
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters')
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
		)
		.withMessage(
			'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
		),
	body('username')
		.notEmpty()
		.withMessage('Username is required')
		.isLength({ min: 3, max: 20 })
		.withMessage('Username must be between 3 and 20 characters')
		.matches(/^[a-zA-Z0-9._-]+$/)
		.withMessage(
			'Username can only contain letters, numbers, dots, hyphens, and underscores',
		)
		.custom((value) => {
			// Don't allow usernames that look like emails
			if (value.includes('@')) {
				throw new Error('Username cannot contain @ symbol');
			}
			return true;
		}),
];

const loginValidation = [
	body('email').isEmail().withMessage('Please provide a valid email'),
	body('password').notEmpty().withMessage('Password is required'),
];

const updatePasswordValidation = [
	body('currentPassword')
		.notEmpty()
		.withMessage('Current password is required'),
	body('newPassword')
		.isLength({ min: 8 })
		.withMessage('New password must be at least 8 characters')
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
		)
		.withMessage(
			'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
		),
];

// Routes
router.post(
	'/register',
	authLimiter,
	validatePasswordStrength,
	registerValidation,
	handleValidationErrors,
	register,
);
router.post(
	'/login',
	authLimiter,
	trackLoginAttempts,
	loginValidation,
	handleValidationErrors,
	login,
);
router.get('/me', protect, getMe);
router.post('/logout', (req, res) => {
	// Simple logout endpoint - JWT is stateless so we just return success
	// Client handles token removal
	res.status(200).json({
		success: true,
		message: 'Logged out successfully',
	});
});
router.put('/updatedetails', protect, updateDetails);
router.put(
	'/updatepassword',
	protect,
	validatePasswordStrength,
	updatePasswordValidation,
	handleValidationErrors,
	updatePassword,
);

// Delete account validation
const deleteAccountValidation = [
	body('password')
		.notEmpty()
		.withMessage('Password is required to delete account'),
];

router.delete(
	'/delete-account',
	protect,
	deleteAccountValidation,
	handleValidationErrors,
	deleteAccount,
);

// Password reset & email verification
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
// Diagnostics: recent resend attempts (limit). Could be restricted to admins; using protect for now.
router.get('/resend-attempts', protect, getResendAttempts);

export default router;
