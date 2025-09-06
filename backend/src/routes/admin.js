import express from 'express';
import { protect, isAdmin } from '../middleware/auth.js';
import { getSeedStatus } from '../controllers/adminController.js';

const router = express.Router();

// Admin-only diagnostics
router.get('/seed-status', protect, isAdmin, getSeedStatus);

export default router;

