#!/usr/bin/env node
/* eslint-env node */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';

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

async function main() {
	await mongoose.connect(uri, { autoIndex: true });

	const adminEmail = 'helderbalbino@googlemail.com';
	const user = await User.findOne({ email: adminEmail }).select(
		'name email username isAdmin isVerified createdAt',
	);

	if (user) {
		console.log('✅ Admin user found:');
		console.log({
			id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			isAdmin: user.isAdmin,
			isVerified: user.isVerified,
			createdAt: user.createdAt,
		});
	} else {
		console.log('❌ Admin user not found:', adminEmail);

		// List all users to see what exists
		const allUsers = await User.find({})
			.select('email username isAdmin')
			.limit(10);
		console.log('\nFirst 10 users in database:');
		if (allUsers.length === 0) {
			console.log('  No users found in database!');
		} else {
			allUsers.forEach((u) => {
				console.log(
					`  ${u.email} (${u.username}) - Admin: ${u.isAdmin}`,
				);
			});
		}
	}

	await mongoose.disconnect();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
