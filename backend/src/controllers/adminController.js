import Cocktail from '../models/Cocktail.js';
import User from '../models/User.js';
import classics from '../data/classicCocktails.js';
import { getCacheMetrics, invalidateCache } from '../middleware/cache.js';
import mongoose from 'mongoose';

const SYSTEM_EMAIL = 'system@classics.local';

export const getSeedStatus = async (req, res) => {
  try {
    const systemUser = await User.findOne({ email: SYSTEM_EMAIL }).lean();
    const filter = { isSystem: true, category: 'classics' };
    const classics = await Cocktail.find(filter)
      .select('name updatedAt createdAt isApproved image.url')
      .sort({ name: 1 })
      .lean();

    const latestUpdatedAt = classics.reduce(
      (acc, c) => (c.updatedAt && c.updatedAt > acc ? c.updatedAt : acc),
      new Date(0),
    );

    res.success(
      {
        systemUser: systemUser
          ? { id: systemUser._id, email: systemUser.email, isAdmin: systemUser.isAdmin }
          : null,
        count: classics.length,
        names: classics.map((c) => c.name),
        latestUpdatedAt,
      },
      { message: 'System classics seed status' },
    );
  } catch (err) {
    res.fail(500, 'Failed to load seed status', 'SEED_STATUS', { detail: err.message });
  }
};

async function ensureSystemUser() {
  const systemEmail = 'system@classics.local';
  let user = await User.findOne({ email: systemEmail });
  if (!user) {
    user = await User.create({
      name: 'Classic Library',
      email: systemEmail,
      password: 'TempPassw0rd!',
      username: 'classiclibrary',
      isVerified: true,
      isAdmin: true,
    });
  }
  return user;
}

export const postSeedClassics = async (req, res) => {
  try {
    const systemUser = await ensureSystemUser();
    let inserted = 0; let updated = 0;
    for (const cocktail of classics) {
      const filter = { name: { $regex: new RegExp(`^${cocktail.name}$`, 'i') } };
      const payload = {
        ...cocktail,
        category: 'classics',
        isApproved: true,
        isSystem: true,
        createdBy: systemUser._id,
        image: cocktail.image || { url: '', publicId: '' },
      };
      const existing = await Cocktail.findOne(filter);
      if (existing) {
        await Cocktail.updateOne({ _id: existing._id }, { $set: payload });
        updated++;
      } else {
        await Cocktail.create(payload);
        inserted++;
      }
    }
    res.success({ inserted, updated }, { message: 'Seeded classics' });
  } catch (err) {
    res.fail(500, 'Seed classics failed', 'SEED_FAIL', { detail: err.message });
  }
};

export const postCacheInvalidate = async (req, res) => {
  try {
    const pattern = req.body?.pattern || '*';
    await invalidateCache(pattern);
    res.success(null, { message: 'Cache invalidated', pattern });
  } catch (err) {
    res.fail(500, 'Cache invalidation failed', 'CACHE_INVALIDATE', { detail: err.message });
  }
};

export const getMetrics = async (req, res) => {
  try {
    const cache = getCacheMetrics();
    const dbState = mongoose.connection.readyState;
    res.success({ cache, dbState }, { message: 'Metrics' });
  } catch (err) {
    res.fail(500, 'Metrics failed', 'METRICS', { detail: err.message });
  }
};

export const promoteUser = async (req, res) => {
  await User.updateOne({ _id: req.params.id }, { $set: { isAdmin: true } });
  res.success(null, { message: 'Promoted' });
};
export const demoteUser = async (req, res) => {
  await User.updateOne({ _id: req.params.id }, { $set: { isAdmin: false } });
  res.success(null, { message: 'Demoted' });
};
export const verifyUser = async (req, res) => {
  await User.updateOne({ _id: req.params.id }, { $set: { isVerified: true } });
  res.success(null, { message: 'Verified' });
};

export const approveCocktail = async (req, res) => {
  await Cocktail.updateOne({ _id: req.params.id }, { $set: { isApproved: true } });
  res.success(null, { message: 'Approved' });
};
export const featureCocktail = async (req, res) => {
  await Cocktail.updateOne({ _id: req.params.id }, { $set: { isFeatured: true } });
  res.success(null, { message: 'Featured' });
};
export const unfeatureCocktail = async (req, res) => {
  await Cocktail.updateOne({ _id: req.params.id }, { $set: { isFeatured: false } });
  res.success(null, { message: 'Unfeatured' });
};
