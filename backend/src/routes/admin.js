import express from 'express';
import { protect, isAdmin } from '../middleware/auth.js';
import {
  getSeedStatus,
  postSeedClassics,
  postCacheInvalidate,
  getMetrics,
  promoteUser,
  demoteUser,
  verifyUser,
  approveCocktail,
  featureCocktail,
  unfeatureCocktail,
} from '../controllers/adminController.js';

const router = express.Router();

// Admin-only diagnostics
router.get('/seed-status', protect, isAdmin, getSeedStatus);
router.post('/seed-classics', protect, isAdmin, postSeedClassics);
router.post('/cache/invalidate', protect, isAdmin, postCacheInvalidate);
router.get('/metrics', protect, isAdmin, getMetrics);

// Users
router.post('/users/:id/promote', protect, isAdmin, promoteUser);
router.post('/users/:id/demote', protect, isAdmin, demoteUser);
router.post('/users/:id/verify', protect, isAdmin, verifyUser);

// Cocktails
router.post('/cocktails/:id/approve', protect, isAdmin, approveCocktail);
router.post('/cocktails/:id/feature', protect, isAdmin, featureCocktail);
router.post('/cocktails/:id/unfeature', protect, isAdmin, unfeatureCocktail);

export default router;
