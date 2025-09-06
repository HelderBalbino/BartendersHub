#!/usr/bin/env node
/* eslint-env node */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';
import { hashPassword } from '../src/utils/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root or backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = (process.env.MONGO_URI || process.env.MONGODB_URI || '').trim();
if (!uri) {
  console.error('Missing MONGO_URI/MONGODB_URI');
  process.exit(1);
}

const argv = process.argv.slice(2);
const get = (key) => {
  const pref = `--${key}=`;
  const arg = argv.find((a) => a.startsWith(pref));
  return arg ? arg.slice(pref.length) : undefined;
};

const email = get('email') || process.env.ADMIN_EMAIL;
const password = get('password') || process.env.ADMIN_PASSWORD || 'Password1!';
const name = get('name') || process.env.ADMIN_NAME || 'Admin';
const username = get('username') || process.env.ADMIN_USERNAME || 'admin';

if (!email) {
  console.error('Provide --email, e.g., node scripts/createAdmin.js --email=you@example.com');
  process.exit(1);
}

async function main() {
  await mongoose.connect(uri, { autoIndex: true });
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      username,
      password: await hashPassword(password),
      isVerified: true,
      isAdmin: true,
    });
    console.log('Created admin user:', email);
  } else {
    user.isAdmin = true;
    if (password) user.password = await hashPassword(password);
    await user.save();
    console.log('Promoted to admin:', email);
  }
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

