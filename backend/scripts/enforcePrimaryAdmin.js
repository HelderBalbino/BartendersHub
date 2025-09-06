#!/usr/bin/env node
/* eslint-env node */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = (process.env.MONGO_URI || process.env.MONGODB_URI || '').trim();
if (!uri) {
  console.error('Missing MONGO_URI/MONGODB_URI');
  process.exit(1);
}

// Primary admin email via CLI or env
const emailArg = process.argv.find((a) => a.startsWith('--email='));
const primaryEmail = (emailArg ? emailArg.split('=')[1] : process.env.PRIMARY_ADMIN_EMAIL || process.env.ADMIN_EMAIL)
  ?.trim()
  .toLowerCase();

if (!primaryEmail) {
  console.error('Provide --email=<primary-admin-email> or set PRIMARY_ADMIN_EMAIL');
  process.exit(1);
}

async function main() {
  await mongoose.connect(uri, { autoIndex: true });
  const allAdmins = await User.find({ isAdmin: true }).select('email isAdmin').lean();
  const toDemote = allAdmins.filter((u) => u.email.toLowerCase() !== primaryEmail);
  const primary = await User.findOne({ email: primaryEmail });
  if (!primary) {
    console.warn('Primary admin user not found by email:', primaryEmail);
  } else if (!primary.isAdmin) {
    await User.updateOne({ _id: primary._id }, { $set: { isAdmin: true, isVerified: true } });
  }
  if (toDemote.length) {
    await User.updateMany(
      { email: { $in: toDemote.map((u) => u.email) } },
      { $set: { isAdmin: false } },
    );
  }
  const summary = {
    kept: primaryEmail,
    demoted: toDemote.map((u) => u.email),
    ensuredPrimaryExists: Boolean(primary),
  };
  console.log('Admin enforcement summary:', summary);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

