#!/usr/bin/env node
import 'dotenv/config';
import mongoose from 'mongoose';
import process from 'process';
import User from '../src/models/User.js';
import connectDB from '../src/config/database.js';

(async () => {
	try {
		const email = process.argv[2];
		if (!email) {
			console.error('Usage: node scripts/verifyUser.js <email>');
			process.exit(1);
		}
		await connectDB();
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			console.error('User not found for email:', email);
			process.exit(1);
		}
		if (user.isVerified) {
			console.log('User already verified.');
			process.exit(0);
		}
		user.isVerified = true;
		user.emailVerificationToken = undefined;
		user.emailVerificationExpire = undefined;
		await user.save();
		console.log('✅ User marked as verified:', email);
		await mongoose.connection.close();
		process.exit(0);
	} catch (e) {
		console.error('Error verifying user:', e.message);
		process.exit(1);
	}
})();
