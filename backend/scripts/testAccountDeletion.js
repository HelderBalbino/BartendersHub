#!/usr/bin/env node

/**
 * Test script for account deletion endpoint
 *
 * Usage: node scripts/testAccountDeletion.js <email> <password>
 */

import dotenv from 'dotenv';
import process from 'process';

// Load environment variables
dotenv.config();

const API_BASE =
	process.env.NODE_ENV === 'production'
		? 'https://bartendershub.onrender.com/api'
		: 'http://localhost:5001/api';

async function testAccountDeletion(email, password) {
	try {
		console.log('🧪 Testing Account Deletion Endpoint...');
		console.log(`📧 Email: ${email}`);
		console.log(`🔗 API: ${API_BASE}`);

		// Step 1: Login to get JWT token
		console.log('\n1️⃣ Logging in...');
		const loginResponse = await fetch(`${API_BASE}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});

		if (!loginResponse.ok) {
			const loginError = await loginResponse.text();
			throw new Error(
				`Login failed: ${loginResponse.status} - ${loginError}`,
			);
		}

		const loginData = await loginResponse.json();
		const token = loginData.token;
		console.log('✅ Login successful');

		// Step 2: Test account deletion
		console.log('\n2️⃣ Testing account deletion...');
		const deleteResponse = await fetch(`${API_BASE}/auth/delete-account`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				password,
			}),
		});

		const deleteData = await deleteResponse.json();

		if (!deleteResponse.ok) {
			throw new Error(
				`Delete failed: ${deleteResponse.status} - ${deleteData.message}`,
			);
		}

		console.log('✅ Account deletion successful');
		console.log('📝 Response:', deleteData);

		// Step 3: Verify account is deleted by trying to login again
		console.log('\n3️⃣ Verifying account deletion...');
		const verifyResponse = await fetch(`${API_BASE}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});

		if (verifyResponse.ok) {
			console.log('❌ ERROR: Account still exists after deletion!');
		} else {
			console.log(
				'✅ Account successfully deleted - login no longer works',
			);
		}
	} catch (error) {
		console.error('❌ Test failed:', error.message);
		process.exit(1);
	}
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
	console.log(
		'Usage: node scripts/testAccountDeletion.js <email> <password>',
	);
	console.log(
		'Example: node scripts/testAccountDeletion.js test@example.com password123',
	);
	process.exit(1);
}

const [email, password] = args;
testAccountDeletion(email, password);
