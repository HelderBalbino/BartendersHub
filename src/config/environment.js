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
		cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
		uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
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
const requiredEnvVars = [
	'VITE_API_URL',
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
		console.warn(
			'Missing environment variables (using defaults):',
			missing,
		);
	}
};

// Initialize environment validation
if (typeof window !== 'undefined') {
	validateEnvironment();
}

export default config;
