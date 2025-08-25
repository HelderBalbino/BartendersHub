#!/usr/bin/env node
// Deep email diagnostics: generates a one-off verification email for a target user or raw test
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import process from 'process';
import mongoose from 'mongoose';
import { createExpiringTokenPair } from '../src/utils/token.js';
import User from '../src/models/User.js';
import { sendVerificationEmail } from '../src/services/emailQueue.js';

// Load environment variables (fix path issue)
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
} else {
	dotenv.config();
}

async function main() {
	const email = process.argv[2];
	if (!email) {
		console.error('Usage: node scripts/debugEmail.js <userEmail>');
		process.exit(1);
	}
	console.log('🔍 Email debug start for', email);
	await mongoose.connect(process.env.MONGODB_URI, {
		serverSelectionTimeoutMS: 5000,
	});
	const user = await User.findOne({ email });
	if (!user) {
		console.error('No user found for that email');
		process.exit(1);
	}
	const { raw, hashed, expire } = createExpiringTokenPair(
		24 * 60 * 60 * 1000,
	);
	user.emailVerificationToken = hashed;
	user.emailVerificationExpire = new Date(expire);
	await user.save();
	console.log(
		'📝 Stored hashed token on user. Sending verification email...',
	);
	await sendVerificationEmail({ name: user.name, email: user.email }, raw);
	console.log(
		'✅ sendVerificationEmail returned (check logs above for SMTP output if EMAIL_DEBUG=true)',
	);
	console.log('👉 Verification URL (copy/paste in browser):');
	const base =
		(process.env.NODE_ENV === 'production' &&
			(process.env.FRONTEND_URL_PROD || process.env.FRONTEND_URL)) ||
		process.env.FRONTEND_URL ||
		'http://localhost:3000';
	console.log(`${base}/verify-email/${raw}`);
	await mongoose.disconnect();
	console.log('🔚 Email debug complete');
}

main().catch((e) => {
	console.error('Fatal:', e);
	process.exit(1);
});
