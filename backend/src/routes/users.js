import express from 'express';
import multer from 'multer';
import path from 'path';
import {
	getUsers,
	getUser,
	getProfile,
	updateProfile,
	toggleFollow,
	getFollowers,
	getFollowing,
	getUserCocktails,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { validateFileUpload } from '../middleware/sanitization.js';

const router = express.Router();

// Multer configuration for avatar uploads with enhanced security
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		// Sanitize filename to prevent path traversal
		const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '');
		cb(null, `avatar-${Date.now()}-${sanitizedName}`);
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 2000000, // 2MB for avatars
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

// Routes
router.get('/', getUsers);
router.get('/profile', protect, getProfile);
router.get('/:id', getUser);
router.put(
	'/profile',
	protect,
	uploadLimiter,
	upload.single('avatar'),
	validateFileUpload,
	updateProfile,
);
router.put('/:id/follow', protect, toggleFollow);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);
router.get('/:id/cocktails', getUserCocktails);

export default router;
