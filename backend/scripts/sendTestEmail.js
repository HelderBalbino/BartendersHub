#!/usr/bin/env node
// Simple manual email send test
import dotenv from 'dotenv';
import process from 'process';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

// Load env from backend/.env explicitly
const backendEnvPath = path.resolve(process.cwd(), 'backend', '.env');
if (fs.existsSync(backendEnvPath)) dotenv.config({ path: backendEnvPath });
dotenv.config();

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;
if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASSWORD) {
	console.error('Missing email env vars');
	process.exit(1);
}

async function main() {
	const transporter = nodemailer.createTransport({
		host: EMAIL_HOST,
		port: Number(EMAIL_PORT),
		secure: Number(EMAIL_PORT) === 465,
		auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
	});
	await transporter.verify();
	const to = process.argv[2] || EMAIL_USER;
	const info = await transporter.sendMail({
		from: process.env.EMAIL_FROM || EMAIL_USER,
		to,
		subject: 'BartendersHub Test Email',
		text: 'If you received this, SMTP credentials are valid.',
	});
	console.log('Sent:', info.messageId);
}

main().catch((e) => {
	console.error('Error:', e.message);
	process.exit(1);
});
