import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getUsers,
  getUser,
  updateProfile,
  toggleFollow,
  getFollowers,
  getFollowing,
  getUserCocktails
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Multer configuration for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000 // 2MB for avatars
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Routes
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/profile', protect, uploadLimiter, upload.single('avatar'), updateProfile);
router.put('/:id/follow', protect, toggleFollow);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);
router.get('/:id/cocktails', getUserCocktails);

export default router;
