#!/usr/bin/env node
/**
 * BartendersHub Health Check Script
 *
 * Performs runtime diagnostics for:
 *  - Environment variable presence
 *  - MongoDB connectivity
 *  - Cloudinary API availability
 *  - Redis (if enabled)
 *  - Email transporter (if credentials provided)
 *
 * Usage:
 *  node scripts/healthCheck.js [--json]
 *
 * Exit codes:
 *  0 = all critical checks passed
 *  1 = one or more critical checks failed
 */
import process from 'process';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import nodemailer from 'nodemailer';

// Lazy load redis client from existing middleware (may be null if disabled)
let redisClient = null;
try {
	const cacheModule = await import('../src/middleware/cache.js');
	redisClient = cacheModule.default || null;
} catch {
	/* ignore */
}

// Configure Cloudinary (mirrors app util but avoids requiring entire app)
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const REQUIRED_ENV = [
	'MONGODB_URI',
	'JWT_SECRET',
	'CLOUDINARY_CLOUD_NAME',
	'CLOUDINARY_API_KEY',
	'CLOUDINARY_API_SECRET',
];

const timeout = (ms, label) =>
	new Promise((_, reject) =>
		setTimeout(
			() => reject(new Error(`Timeout after ${ms}ms (${label})`)),
			ms,
		),
	);

async function timed(label, fn, ms = 5000) {
	const start = performance.now();
	try {
		const result = await Promise.race([fn(), timeout(ms, label)]);
		const duration = +(performance.now() - start).toFixed(2);
		return { ok: true, durationMs: duration, result };
	} catch (error) {
		const duration = +(performance.now() - start).toFixed(2);
		return { ok: false, durationMs: duration, error: error.message };
	}
}

async function checkEnv() {
	const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
	return { ok: missing.length === 0, missing };
}

async function checkMongo() {
	if (!process.env.MONGODB_URI)
		return { ok: false, error: 'MONGODB_URI missing' };
	const conn = await mongoose
		.createConnection(process.env.MONGODB_URI, {
			serverSelectionTimeoutMS: 3000,
		})
		.asPromise();
	const state = conn.readyState === 1 ? 'connected' : 'not-connected';
	await conn.close();
	return { ok: state === 'connected', state };
}

async function checkCloudinary() {
	if (!process.env.CLOUDINARY_CLOUD_NAME)
		return { ok: false, error: 'Cloudinary env incomplete' };
	try {
		const res = await cloudinary.v2.api.ping();
		return { ok: res.status === 'ok', rawStatus: res.status };
	} catch (e) {
		return { ok: false, error: e.message };
	}
}

async function checkRedis() {
	if (!redisClient)
		return {
			ok: true,
			skipped: true,
			reason: 'Redis disabled or not configured',
		};
	try {
		const pong = await redisClient.ping();
		return { ok: pong === 'PONG', pong };
	} catch (e) {
		return { ok: false, error: e.message };
	}
}

async function checkEmail() {
	const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;
	if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASSWORD) {
		return {
			ok: true,
			skipped: true,
			reason: 'Email creds not fully provided',
		};
	}
	try {
		const transporter = nodemailer.createTransport({
			host: EMAIL_HOST,
			port: Number(EMAIL_PORT),
			secure: Number(EMAIL_PORT) === 465,
			auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
		});
		await transporter.verify();
		return { ok: true };
	} catch (e) {
		return { ok: false, error: e.message };
	}
}

(async () => {
	const [envRes, mongoRes, cloudRes, redisRes, emailRes] = await Promise.all([
		timed('env', checkEnv),
		timed('mongo', checkMongo),
		timed('cloudinary', checkCloudinary),
		timed('redis', checkRedis),
		timed('email', checkEmail),
	]);

	const summary = {
		timestamp: new Date().toISOString(),
		environment: envRes.result || envRes,
		mongo: mongoRes.result || mongoRes,
		cloudinary: cloudRes.result || cloudRes,
		redis: redisRes.result || redisRes,
		email: emailRes.result || emailRes,
		timingsMs: {
			env: envRes.durationMs,
			mongo: mongoRes.durationMs,
			cloudinary: cloudRes.durationMs,
			redis: redisRes.durationMs,
			email: emailRes.durationMs,
		},
	};

	const criticalOk =
		summary.environment.ok && summary.mongo.ok && summary.cloudinary.ok;

	const asJson = process.argv.includes('--json');
	if (asJson) {
		console.log(JSON.stringify(summary, null, 2));
	} else {
		console.log('\nBartendersHub Health Check');
		console.log('================================');
		console.log(
			'Env vars:      ',
			summary.environment.ok
				? 'OK'
				: `Missing: ${summary.environment.missing.join(',')}`,
		);
		console.log(
			'MongoDB:       ',
			summary.mongo.ok
				? 'OK'
				: `FAIL (${summary.mongo.error || summary.mongo.state})`,
		);
		console.log(
			'Cloudinary:    ',
			summary.cloudinary.ok
				? 'OK'
				: `FAIL (${
						summary.cloudinary.error || summary.cloudinary.rawStatus
				  })`,
		);
		console.log(
			'Redis:         ',
			summary.redis.skipped
				? 'SKIPPED'
				: summary.redis.ok
				? 'OK'
				: `FAIL (${summary.redis.error})`,
		);
		console.log(
			'Email:         ',
			summary.email.skipped
				? 'SKIPPED'
				: summary.email.ok
				? 'OK'
				: `FAIL (${summary.email.error})`,
		);
		console.log('Timings (ms):  ', summary.timingsMs);
		console.log('================================');
		console.log(
			criticalOk
				? 'ALL CRITICAL CHECKS PASSED'
				: 'ONE OR MORE CRITICAL CHECKS FAILED',
		);
	}

	process.exit(criticalOk ? 0 : 1);
})();
