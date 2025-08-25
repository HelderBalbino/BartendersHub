#!/usr/bin/env node

/**
 * Create a test user for account deletion testing
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import process from 'process';
import User from '../src/models/User.js';
import connectDB from '../src/config/database.js';
import { hashPassword } from '../src/utils/auth.js';

async function createTestUser() {
	try {
		await connectDB();

		const testEmail = 'delete-test@example.com';
		const testPassword = 'TestPassword123!';

		// Check if user already exists
		const existingUser = await User.findOne({ email: testEmail });
		if (existingUser) {
			console.log('✅ Test user already exists:', testEmail);
			await mongoose.connection.close();
			return;
		}

		// Create test user
		const hashedPassword = await hashPassword(testPassword);
		const testUser = new User({
			name: 'Test User',
			username: 'deletetest',
			email: testEmail,
			password: hashedPassword,
			isVerified: true, // Make it verified so we can test deletion
		});

		await testUser.save();
		console.log('✅ Test user created successfully:');
		console.log(`📧 Email: ${testEmail}`);
		console.log(`🔑 Password: ${testPassword}`);
		console.log(`👤 Username: deletetest`);

		await mongoose.connection.close();
	} catch (error) {
		console.error('❌ Failed to create test user:', error.message);
		process.exit(1);
	}
}

createTestUser();
