// Temporary debug file to check environment variables
console.log('=== Environment Variables Debug ===');
console.log(
	'VITE_CLOUDINARY_CLOUD_NAME:',
	import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
);
console.log(
	'VITE_CLOUDINARY_UPLOAD_PRESET:',
	import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log(
	'All VITE_ env vars:',
	Object.keys(import.meta.env).filter((key) => key.startsWith('VITE_')),
);
console.log('===================================');
