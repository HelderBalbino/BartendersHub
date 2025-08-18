import mongoose from 'mongoose';
import process from 'process';

const MONGODB_URI =
	process.env.MONGODB_URI_TEST ||
	'mongodb://localhost:27017/bartendershub_test';

export const connectDB = async () => {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('Test database connected');
	} catch (error) {
		console.error('Test database connection error:', error);
		// Throw instead of exiting so Jest can report properly
		throw error;
	}
};

export const closeDB = async () => {
	await mongoose.connection.close();
};

export const clearDB = async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		await collections[key].deleteMany({});
	}
};
