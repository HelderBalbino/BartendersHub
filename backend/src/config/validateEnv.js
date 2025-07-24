import process from 'process';

// Environment variables validation
export const validateEnvironmentVariables = () => {
	const requiredEnvVars = [
		'MONGODB_URI',
		'JWT_SECRET',
		'CLOUDINARY_CLOUD_NAME',
		'CLOUDINARY_API_KEY',
		'CLOUDINARY_API_SECRET',
	];

	const missingVars = requiredEnvVars.filter(
		(envVar) => !process.env[envVar],
	);

	if (missingVars.length > 0) {
		console.error('❌ Missing required environment variables:');
		missingVars.forEach((envVar) => {
			console.error(`   - ${envVar}`);
		});
		process.exit(1);
	}

	// Validate JWT_SECRET strength
	if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
		console.error(
			'❌ JWT_SECRET must be at least 32 characters long for security',
		);
		process.exit(1);
	}

	// Validate NODE_ENV
	const validNodeEnvs = ['development', 'production', 'test'];
	if (process.env.NODE_ENV && !validNodeEnvs.includes(process.env.NODE_ENV)) {
		console.error(
			'❌ NODE_ENV must be one of: development, production, test',
		);
		process.exit(1);
	}

	console.log('✅ Environment variables validated successfully');
};
