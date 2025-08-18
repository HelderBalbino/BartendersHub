import mongoose from 'mongoose';
import process from 'process';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer;
const useMemory = process.env.USE_IN_MEMORY_DB !== 'false';
const fallbackUri = 'mongodb://localhost:27017/bartendershub_test';
const explicitTestUri = process.env.MONGODB_URI_TEST;
const getUri = async () => {
	if (useMemory) {
		if (!memoryServer) memoryServer = await MongoMemoryServer.create();
		return memoryServer.getUri('bartendershub_test');
	}
	return explicitTestUri || fallbackUri;
};

export const connectDB = async () => {
	try {
		const uri = await getUri();
		await mongoose.connect(uri);
		console.log('Test database connected:', uri);
	} catch (error) {
		console.error('Test database connection error:', error);
		throw error;
	}
};

export const closeDB = async () => {
	await mongoose.connection.close();
	if (memoryServer) {
		await memoryServer.stop();
		memoryServer = null;
	}
};

export const clearDB = async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		await collections[key].deleteMany({});
	}
};
