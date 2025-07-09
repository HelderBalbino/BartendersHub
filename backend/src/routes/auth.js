import express from 'express';
import { body } from 'express-validator';
import {
	register,
	login,
	getMe,
	updateDetails,
	updatePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/errorHandler.js';
import { authLimiter } from '../middleware/rateLimiter.js';

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
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters'),
	body('username')
		.notEmpty()
		.withMessage('Username is required')
		.isLength({ min: 3, max: 20 })
		.withMessage('Username must be between 3 and 20 characters')
		.matches(/^[a-zA-Z0-9_]+$/)
		.withMessage(
			'Username can only contain letters, numbers, and underscores',
		),
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
		.isLength({ min: 6 })
		.withMessage('New password must be at least 6 characters'),
];

// Routes
router.post(
	'/register',
	authLimiter,
	registerValidation,
	handleValidationErrors,
	register,
);
router.post(
	'/login',
	authLimiter,
	loginValidation,
	handleValidationErrors,
	login,
);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put(
	'/updatepassword',
	protect,
	updatePasswordValidation,
	handleValidationErrors,
	updatePassword,
);

export default router;
