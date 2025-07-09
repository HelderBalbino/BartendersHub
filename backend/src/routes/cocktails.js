import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import {
	getCocktails,
	getCocktail,
	createCocktail,
	updateCocktail,
	deleteCocktail,
	toggleLike,
	addComment,
	rateCocktail,
} from '../controllers/cocktailController.js';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/errorHandler.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, `cocktail-${Date.now()}${path.extname(file.originalname)}`);
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000, // 5MB default
	},
	fileFilter: function (req, file, cb) {
		// Check file type
		if (file.mimetype.startsWith('image/')) {
			cb(null, true);
		} else {
			cb(new Error('Only image files are allowed'), false);
		}
	},
});

// Validation rules
const createCocktailValidation = [
	body('name')
		.notEmpty()
		.withMessage('Cocktail name is required')
		.isLength({ max: 100 })
		.withMessage('Cocktail name cannot exceed 100 characters'),
	body('description')
		.notEmpty()
		.withMessage('Description is required')
		.isLength({ max: 500 })
		.withMessage('Description cannot exceed 500 characters'),
	body('difficulty')
		.isIn(['beginner', 'intermediate', 'advanced', 'expert'])
		.withMessage('Invalid difficulty level'),
	body('prepTime')
		.isInt({ min: 1 })
		.withMessage('Preparation time must be at least 1 minute'),
	body('servings')
		.isInt({ min: 1 })
		.withMessage('Servings must be at least 1'),
	body('glassType').notEmpty().withMessage('Glass type is required'),
];

const commentValidation = [
	body('text')
		.notEmpty()
		.withMessage('Comment text is required')
		.isLength({ max: 500 })
		.withMessage('Comment cannot exceed 500 characters'),
];

const ratingValidation = [
	body('rating')
		.isInt({ min: 1, max: 5 })
		.withMessage('Rating must be between 1 and 5'),
];

// Routes
router.get('/', getCocktails);
router.get('/:id', getCocktail);
router.post(
	'/',
	protect,
	uploadLimiter,
	upload.single('image'),
	createCocktailValidation,
	handleValidationErrors,
	createCocktail,
);
router.put(
	'/:id',
	protect,
	uploadLimiter,
	upload.single('image'),
	updateCocktail,
);
router.delete('/:id', protect, deleteCocktail);
router.put('/:id/like', protect, toggleLike);
router.post(
	'/:id/comments',
	protect,
	commentValidation,
	handleValidationErrors,
	addComment,
);
router.post(
	'/:id/rating',
	protect,
	ratingValidation,
	handleValidationErrors,
	rateCocktail,
);

export default router;
