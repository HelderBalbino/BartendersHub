#!/usr/bin/env node
/*
 Seed classic cocktails.
 - Upsert by case-insensitive name
 - Associates with (or creates) a system user
 - Marks isApproved + isSystem true
 - Injects placeholder image if none supplied
*/
/* eslint-env node */
/* global process */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Cocktail from '../src/models/Cocktail.js';
import User from '../src/models/User.js';
import classics from '../src/data/classicCocktails.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading env from project root, then backend/.env if still missing
const rootEnvPath = path.resolve(__dirname, '../../.env');
const backendEnvPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: rootEnvPath });
if (!process.env.MONGO_URI) {
	dotenv.config({ path: backendEnvPath });
}

if (!process.env.MONGO_URI) {
	console.error(
		'MONGO_URI not set. Provide it in project root .env, backend/.env, or inline: MONGO_URI="mongodb+srv://<user>:<pass>@host/db" npm run seed:classics',
	);
	process.exit(1);
}

const normalizedUri = process.env.MONGO_URI.trim();
if (
	normalizedUri === 'your-mongodb-connection-string' ||
	!/^mongodb(\+srv)?:\/\//.test(normalizedUri)
) {
	console.error(
		'Invalid MONGO_URI. It must start with mongodb:// or mongodb+srv:// and not be a placeholder.',
	);
	process.exit(1);
}

console.log('Using Mongo URI from environment');

const PLACEHOLDER_IMAGE = {
	url: 'https://res.cloudinary.com/bartendershub/image/upload/v1/classics/placeholder.jpg',
	publicId: 'classics/placeholder',
};

async function ensureSystemUser() {
	const systemEmail = 'system@classics.local';
	let user = await User.findOne({ email: systemEmail });
	if (!user) {
		user = await User.create({
			name: 'Classic Library',
			email: systemEmail,
			password: 'TempPassw0rd!', // meets schema regex; not used for login (could randomize)
			username: 'classiclibrary',
			isVerified: true,
			isAdmin: true,
		});
		console.log('Created system user');
	} else {
		console.log('Using existing system user');
	}
	return user;
}

async function seed() {
	await mongoose.connect(process.env.MONGO_URI, {
		autoIndex: true,
	});
	console.log('Connected to MongoDB');

	const systemUser = await ensureSystemUser();

	let inserted = 0;
	let updated = 0;

	for (const cocktail of classics) {
		const filter = {
			name: { $regex: new RegExp(`^${cocktail.name}$`, 'i') },
		};

		const payload = {
			...cocktail,
			category: 'classics',
			isApproved: true,
			isSystem: true,
			createdBy: systemUser._id,
			image: cocktail.image || PLACEHOLDER_IMAGE,
		};

		const existing = await Cocktail.findOne(filter);
		if (existing) {
			await Cocktail.updateOne({ _id: existing._id }, { $set: payload });
			updated++;
			console.log(`Updated: ${cocktail.name}`);
		} else {
			await Cocktail.create(payload);
			inserted++;
			console.log(`Inserted: ${cocktail.name}`);
		}
	}

	console.log(`\nDone. Inserted: ${inserted}, Updated: ${updated}`);
	await mongoose.disconnect();
	process.exit(0);
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
