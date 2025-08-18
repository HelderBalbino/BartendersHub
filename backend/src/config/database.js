import mongoose from 'mongoose';
import process from 'process';

const connectDB = async () => {
	try {
		// Mongoose security settings
		mongoose.set('strictQuery', true);

		// Choose DB URI (prefer explicit test URI when in test environment)
		const isTest = process.env.NODE_ENV === 'test';
		const dbUri = isTest
			? process.env.MONGODB_URI_TEST ||
			  'mongodb://localhost:27017/bartendershub_test'
			: process.env.MONGODB_URI;

		const conn = await mongoose.connect(dbUri, {
			// Security and performance options
			maxPoolSize: 10, // Maintain up to 10 socket connections
			serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
			// Removed deprecated bufferMaxEntries option
			bufferCommands: false, // Disable mongoose buffering
		});

		console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

		// Handle connection events
		mongoose.connection.on('error', (err) => {
			console.error('MongoDB connection error:', err);
		});

		mongoose.connection.on('disconnected', () => {
			console.log('MongoDB disconnected');
		});

		// Graceful shutdown
		process.on('SIGINT', async () => {
			await mongoose.connection.close();
			console.log('MongoDB connection closed through app termination');
			process.exit(0);
		});
	} catch (error) {
		console.error(`❌ Database connection error: ${error.message}`);
		if (process.env.NODE_ENV === 'test') {
			// Throw to let Jest fail gracefully instead of exiting the process
			throw error;
		} else {
			process.exit(1);
		}
	}
};

export default connectDB;
