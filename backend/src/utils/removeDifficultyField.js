import dotenv from 'dotenv';
import process from 'process';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';

/*
 * One-off maintenance script to drop old difficulty indexes (if present)
 * and remove the deprecated `difficulty` field from existing cocktail documents.
 *
 * Usage:
 *  node src/utils/removeDifficultyField.js
 */

dotenv.config();

const run = async () => {
	try {
		await connectDB();

		const db = mongoose.connection.db;
		const collection = db.collection('cocktails');

		console.log('🔍 Fetching existing indexes...');
		const indexes = await collection.indexes();

		// Identify indexes referencing difficulty
		const difficultyIndexes = indexes.filter(
			(idx) => idx.key && idx.key.difficulty,
		);

		if (difficultyIndexes.length === 0) {
			console.log('✅ No difficulty indexes found.');
		} else {
			for (const idx of difficultyIndexes) {
				console.log(`🗑️  Dropping index: ${idx.name}`);
				try {
					await collection.dropIndex(idx.name);
					console.log(`   ➤ Dropped ${idx.name}`);
				} catch (err) {
					console.warn(
						`   ⚠️  Could not drop ${idx.name}:`,
						err.message,
					);
				}
			}
		}

		console.log(
			'🔄 Unsetting difficulty field from existing documents (if any)...',
		);
		const updateResult = await collection.updateMany(
			{ difficulty: { $exists: true } },
			{ $unset: { difficulty: '' } },
		);

		console.log(
			`✅ Documents matched: ${updateResult.matchedCount}, modified: ${updateResult.modifiedCount}`,
		);

		console.log('🏁 Maintenance complete.');
	} catch (err) {
		console.error('❌ Maintenance script failed:', err);
	} finally {
		await mongoose.connection.close();
		process.exit(0);
	}
};

run();
