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

async function attempt(label, config) {
	try {
		console.log(`\n--- Attempt: ${label} ---`);
		const transporter = nodemailer.createTransport({ ...config, auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD } });
		await transporter.verify();
		const to = process.argv[2] || EMAIL_USER;
		const info = await transporter.sendMail({
			from: process.env.EMAIL_FROM || EMAIL_USER,
			to,
			subject: `BartendersHub Test Email (${label})`,
			text: 'If you received this, SMTP credentials are valid.',
		});
		console.log(`SUCCESS via ${label}:`, info.messageId);
		return true;
	} catch (e) {
		console.error(`FAIL via ${label}:`, e.message);
		if (e.response) console.error('Server response:', e.response);
		return false;
	}
}

async function main() {
	const configs = [
		{
			label: 'Explicit Gmail 587 STARTTLS',
			cfg: { host: EMAIL_HOST, port: 587, secure: false, logger: true, debug: true },
		},
		{
			label: 'Explicit Gmail 465 SSL',
			cfg: { host: EMAIL_HOST, port: 465, secure: true, logger: true, debug: true },
		},
		{
			label: 'Service gmail (nodemailer shortcut)',
			cfg: { service: 'gmail', logger: true, debug: true },
		},
	];

	for (const { label, cfg } of configs) {
		const ok = await attempt(label, cfg);
		if (ok) return; // stop after first success
	}
	console.error('\nAll attempts failed. See above for diagnostics.');
	console.log('Troubleshooting checklist:\n - Confirm App Password (16 chars) copied exactly (no spaces)\n - Ensure 2FA is enabled on the Gmail account\n - Regenerate a new App Password if unsure\n - Account security page: https://myaccount.google.com/security\n - Consider switching to a dedicated provider (Resend, Mailersend, SES) for reliability');
}

main().catch((e) => {
	console.error('Error:', e.message);
	process.exit(1);
});
