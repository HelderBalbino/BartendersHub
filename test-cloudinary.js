// Test Cloudinary Configuration
console.log('=== Cloudinary Environment Test ===');
console.log(
	'VITE_CLOUDINARY_CLOUD_NAME:',
	import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
);
console.log(
	'VITE_CLOUDINARY_UPLOAD_PRESET:',
	import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
);

// Test if Cloudinary URL is constructed correctly
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
console.log('Upload URL:', CLOUDINARY_UPLOAD_URL);

// Test basic fetch to Cloudinary (should return method not allowed but confirms URL is reachable)
fetch(CLOUDINARY_UPLOAD_URL, { method: 'GET' })
	.then((response) => {
		console.log('Cloudinary API Response Status:', response.status);
		console.log('Cloudinary API Response Headers:', [
			...response.headers.entries(),
		]);
		if (response.status === 405) {
			console.log(
				'✅ Cloudinary API is reachable (405 = Method Not Allowed for GET, which is expected)',
			);
		} else {
			console.log('❓ Unexpected response status');
		}
	})
	.catch((error) => {
		console.log('❌ Error reaching Cloudinary API:', error);
	});
