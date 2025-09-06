import Cocktail from '../models/Cocktail.js';
import User from '../models/User.js';

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

