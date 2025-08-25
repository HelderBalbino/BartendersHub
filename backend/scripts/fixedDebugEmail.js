#!/usr/bin/env node
// Fixed email debug script that loads env before importing services
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import process from 'process';

// Load environment variables FIRST
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
} else {
	dotenv.config();
}

// Now import modules that depend on env vars
import mongoose from 'mongoose';
import { createExpiringTokenPair } from '../src/utils/token.js';
import User from '../src/models/User.js';

// Create email transporter directly
import nodemailer from 'nodemailer';

async function main() {
	const email = process.argv[2];
	if (!email) {
		console.error('Usage: node scripts/fixedDebugEmail.js <userEmail>');
		process.exit(1);
	}

	console.log('🔍 Email debug start for', email);
	console.log('📧 Email config check:');
	console.log('  EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
	console.log('  EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET');
	console.log('  EMAIL_HOST:', process.env.EMAIL_HOST || 'DEFAULT');

	// Connect to database
	await mongoose.connect(process.env.MONGODB_URI, {
		serverSelectionTimeoutMS: 5000,
	});

	// Find user
	const user = await User.findOne({ email });
	if (!user) {
		console.error('❌ No user found for that email');
		process.exit(1);
	}

	// Generate token
	const { raw, hashed, expire } = createExpiringTokenPair(24 * 60 * 60 * 1000);
	user.emailVerificationToken = hashed;
	user.emailVerificationExpire = new Date(expire);
	await user.save();

	console.log('📝 Stored hashed token on user');

	// Create transporter and send email
	if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
		const transporter = nodemailer.createTransporter({
			host: process.env.EMAIL_HOST || 'smtp.gmail.com',
			port: parseInt(process.env.EMAIL_PORT) || 587,
			secure: false,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
			logger: true,
			debug: true,
		});

		const frontendBase = 
			(process.env.NODE_ENV === 'production' && 
				(process.env.FRONTEND_URL_PROD || process.env.FRONTEND_URL)) ||
			process.env.FRONTEND_URL ||
			'http://localhost:3000';

		const verifyUrl = `${frontendBase}/verify-email/${raw}`;

		const emailHtml = `
			<div style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); color: #f3f4f6; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
				<div style="border: 2px solid #fbbf24; padding: 30px; text-align: center;">
					<h1 style="color: #fbbf24; font-size: 28px; margin-bottom: 20px; letter-spacing: 2px;">🥃 BARTENDERSHUB</h1>
					<h2 style="color: #ffffff; font-size: 24px; margin-bottom: 30px;">Verify Your Email</h2>
					<p style="color: #d1d5db; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
						Welcome to BartendersHub, ${user.name}! Click the button below to verify your email and start crafting liquid poetry.
					</p>
					<a href="${verifyUrl}" style="background: #fbbf24; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 16px; border: none; cursor: pointer; letter-spacing: 1px;">
						VERIFY EMAIL
					</a>
					<p style="color: #9ca3af; font-size: 14px; margin-top: 30px; line-height: 1.4;">
						If the button doesn't work, copy and paste this link:<br>
						<span style="color: #fbbf24; word-break: break-all;">${verifyUrl}</span>
					</p>
				</div>
			</div>
		`;

		try {
			const info = await transporter.sendMail({
				from: `"BartendersHub" <${process.env.EMAIL_USER}>`,
				to: email,
				subject: 'Verify your email - BartendersHub',
				html: emailHtml,
			});

			console.log('✅ Email sent successfully!');
			console.log('📧 Message ID:', info.messageId);
		} catch (error) {
			console.error('❌ Failed to send email:', error.message);
		}
	} else {
		console.error('❌ Email not configured');
	}

	console.log('👉 Verification URL (manual):');
	const frontendBase = 
		(process.env.NODE_ENV === 'production' && 
			(process.env.FRONTEND_URL_PROD || process.env.FRONTEND_URL)) ||
		process.env.FRONTEND_URL ||
		'http://localhost:3000';
	console.log(`${frontendBase}/verify-email/${raw}`);

	await mongoose.connection.close();
	console.log('🔚 Email debug complete');
	process.exit(0);
}

main().catch(console.error);
