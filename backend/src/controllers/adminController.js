import Cocktail from '../models/Cocktail.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
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
    await AuditLog.create({
      actor: req.user._id,
      action: 'seed_classics',
      targetType: 'system',
      targetId: 'classics',
      meta: { inserted, updated },
    });
  } catch (err) {
    res.fail(500, 'Seed classics failed', 'SEED_FAIL', { detail: err.message });
  }
};

export const postCacheInvalidate = async (req, res) => {
  try {
    const pattern = req.body?.pattern || '*';
    await invalidateCache(pattern);
    res.success(null, { message: 'Cache invalidated', pattern });
    await AuditLog.create({
      actor: req.user._id,
      action: 'cache_invalidate',
      targetType: 'system',
      targetId: 'cache',
      meta: { pattern },
    });
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
  await AuditLog.create({
    actor: req.user._id,
    action: 'user_promote',
    targetType: 'user',
    targetId: req.params.id,
  });
};
export const demoteUser = async (req, res) => {
  await User.updateOne({ _id: req.params.id }, { $set: { isAdmin: false } });
  res.success(null, { message: 'Demoted' });
  await AuditLog.create({
    actor: req.user._id,
    action: 'user_demote',
    targetType: 'user',
    targetId: req.params.id,
  });
};
export const verifyUser = async (req, res) => {
  await User.updateOne({ _id: req.params.id }, { $set: { isVerified: true } });
  res.success(null, { message: 'Verified' });
  await AuditLog.create({
    actor: req.user._id,
    action: 'user_verify',
    targetType: 'user',
    targetId: req.params.id,
  });
};

export const approveCocktail = async (req, res) => {
  await Cocktail.updateOne({ _id: req.params.id }, { $set: { isApproved: true } });
  res.success(null, { message: 'Approved' });
  await AuditLog.create({
    actor: req.user._id,
    action: 'cocktail_approve',
    targetType: 'cocktail',
    targetId: req.params.id,
  });
};
export const featureCocktail = async (req, res) => {
  await Cocktail.updateOne({ _id: req.params.id }, { $set: { isFeatured: true } });
  res.success(null, { message: 'Featured' });
  await AuditLog.create({
    actor: req.user._id,
    action: 'cocktail_feature',
    targetType: 'cocktail',
    targetId: req.params.id,
  });
};
export const unfeatureCocktail = async (req, res) => {
  await Cocktail.updateOne({ _id: req.params.id }, { $set: { isFeatured: false } });
  res.success(null, { message: 'Unfeatured' });
  await AuditLog.create({
    actor: req.user._id,
    action: 'cocktail_unfeature',
    targetType: 'cocktail',
    targetId: req.params.id,
  });
};

export const getAuditLog = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 500);
  const items = await AuditLog.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  res.success({ items }, { count: items.length });
};

// Bulk operations
export const bulkUsers = async (req, res) => {
  const { ids = [], op } = req.body || {};
  if (!Array.isArray(ids) || !ids.length) return res.fail(400, 'No ids provided', 'BAD_REQUEST');
  let update = {};
  if (op === 'promote') update = { isAdmin: true };
  else if (op === 'demote') update = { isAdmin: false };
  else if (op === 'verify') update = { isVerified: true };
  else return res.fail(400, 'Invalid op', 'BAD_REQUEST');
  await User.updateMany({ _id: { $in: ids } }, { $set: update });
  await AuditLog.create({ actor: req.user._id, action: `users_${op}`, targetType: 'user', targetId: ids.join(','), meta: { count: ids.length } });
  res.success(null, { message: 'Bulk users updated', count: ids.length });
};

export const bulkCocktails = async (req, res) => {
  const { ids = [], op } = req.body || {};
  if (!Array.isArray(ids) || !ids.length) return res.fail(400, 'No ids provided', 'BAD_REQUEST');
  let update = {};
  if (op === 'approve') update = { isApproved: true };
  else if (op === 'feature') update = { isFeatured: true };
  else if (op === 'unfeature') update = { isFeatured: false };
  else return res.fail(400, 'Invalid op', 'BAD_REQUEST');
  await Cocktail.updateMany({ _id: { $in: ids } }, { $set: update });
  await AuditLog.create({ actor: req.user._id, action: `cocktails_${op}`, targetType: 'cocktail', targetId: ids.join(','), meta: { count: ids.length } });
  res.success(null, { message: 'Bulk cocktails updated', count: ids.length });
};
