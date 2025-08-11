// Environment variable configuration with type checking and defaults
const config = {
	api: {
		baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
		timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
	},

	app: {
		name: import.meta.env.VITE_APP_NAME || 'BartendersHub',
		version: import.meta.env.VITE_APP_VERSION || '1.0.0',
		environment: import.meta.env.NODE_ENV || 'development',
	},

	cloudinary: {
		cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxcjxxq6h',
		uploadPreset:
			import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
			'bartendershub_uploads',
	},

	features: {
		enableDevtools: import.meta.env.DEV || false,
		enableServiceWorker: import.meta.env.VITE_ENABLE_SW === 'true',
		enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
	},

	security: {
		csrfToken: import.meta.env.VITE_CSRF_TOKEN || '',
		apiKey: import.meta.env.VITE_API_KEY || '',
	},

	performance: {
		imageQuality: parseInt(import.meta.env.VITE_IMAGE_QUALITY) || 80,
		cacheTimeout: parseInt(import.meta.env.VITE_CACHE_TIMEOUT) || 300000, // 5 minutes
		maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5000000, // 5MB
	},
};

// Validate required environment variables
const requiredEnvVars = ['VITE_API_URL'];

// Optional environment variables (warn if missing but don't fail)
const optionalEnvVars = [
	'VITE_CLOUDINARY_CLOUD_NAME',
	'VITE_CLOUDINARY_UPLOAD_PRESET',
];

const validateEnvironment = () => {
	const missing = requiredEnvVars.filter(
		(varName) => !import.meta.env[varName],
	);

	if (missing.length > 0 && config.app.environment === 'production') {
		console.error('Missing required environment variables:', missing);
		throw new Error(
			`Missing required environment variables: ${missing.join(', ')}`,
		);
	}

	if (missing.length > 0) {
		console.info(
			'Missing required environment variables (using defaults):',
			missing,
		);
	}

	// Don't show optional variable warnings in development since we have defaults
	if (config.app.environment === 'production') {
		const missingOptional = optionalEnvVars.filter(
			(varName) => !import.meta.env[varName],
		);

		if (missingOptional.length > 0) {
			console.warn(
				'Optional environment variables not found (features may be limited):',
				missingOptional,
			);
		}
	}
};

// Initialize environment validation
if (typeof window !== 'undefined') {
	validateEnvironment();
}

export default config;
