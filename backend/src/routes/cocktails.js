import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import process from 'process';
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
import { cacheMiddleware } from '../middleware/cache.js';
import { validateFileUpload } from '../middleware/sanitization.js';

const router = express.Router();

// Enhanced multer configuration for file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		// Sanitize filename to prevent path traversal
		const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '');
		cb(null, `cocktail-${Date.now()}-${sanitizedName}`);
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000, // 5MB default
		files: 1, // Only one file
	},
	fileFilter: function (req, file, cb) {
		// Strict file type checking
		const allowedMimeTypes = [
			'image/jpeg',
			'image/jpg',
			'image/png',
			'image/webp',
		];
		const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

		const fileExtension = path.extname(file.originalname).toLowerCase();

		if (
			allowedMimeTypes.includes(file.mimetype) &&
			allowedExtensions.includes(fileExtension)
		) {
			cb(null, true);
		} else {
			cb(
				new Error('Only JPEG, PNG, and WebP image files are allowed'),
				false,
			);
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
router.get('/', cacheMiddleware(600), getCocktails); // Cache for 10 minutes
router.get('/:id', cacheMiddleware(300), getCocktail); // Cache for 5 minutes
router.post(
	'/',
	protect,
	uploadLimiter,
	upload.single('image'),
	validateFileUpload,
	createCocktailValidation,
	handleValidationErrors,
	createCocktail,
);
router.put(
	'/:id',
	protect,
	uploadLimiter,
	upload.single('image'),
	validateFileUpload,
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
