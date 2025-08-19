import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import process from 'process';

// Configure cloudinary
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to cloudinary
export const uploadImage = async (imagePath, folder = 'cocktails') => {
	const UPLOADS_ROOT = path.resolve('./uploads');
	try {
		// Resolve and validate the imagePath
		const resolvedPath = path.resolve(imagePath);

		// Ensure the resolved path is within the uploads directory
		if (!resolvedPath.startsWith(UPLOADS_ROOT)) {
			throw new Error('Invalid file path - path traversal detected');
		}

		// Additional security check - ensure file exists and is readable
		if (!fs.existsSync(resolvedPath)) {
			throw new Error('File does not exist');
		}

		const result = await cloudinary.v2.uploader.upload(resolvedPath, {
			folder: `bartendershub/${folder}`,
			width: 800,
			height: 600,
			crop: 'limit',
			quality: 'auto:best',
			resource_type: 'image',
			allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
		});

		// Delete the local file after upload
		fs.unlinkSync(resolvedPath);

		return {
			url: result.secure_url,
			publicId: result.public_id,
		};
	} catch (error) {
		// Delete the local file if upload fails
		const resolvedPath = path.resolve(imagePath);
		if (
			resolvedPath.startsWith(UPLOADS_ROOT) &&
			fs.existsSync(resolvedPath)
		) {
			fs.unlinkSync(resolvedPath);
		}
		throw error;
	}
};

// Delete image from cloudinary
export const deleteImage = async (publicId) => {
	try {
		// Validate pattern to avoid arbitrary deletions
		const pattern =
			/^bartendershub\/(cocktails|avatars)\/[A-Za-z0-9_\-/]+$/;
		if (!pattern.test(publicId)) {
			console.warn(
				'Refusing to delete Cloudinary asset with suspicious publicId:',
				publicId,
			);
			return;
		}
		await cloudinary.v2.uploader.destroy(publicId);
	} catch (error) {
		console.error('Error deleting image from cloudinary:', error);
	}
};

// Upload avatar to cloudinary
export const uploadAvatar = async (imagePath) => {
	const UPLOADS_ROOT = path.resolve('./uploads'); // Define the safe root directory
	try {
		// Resolve and validate the imagePath
		const resolvedPath = path.resolve(imagePath);

		// Ensure the resolved path is within the uploads directory
		if (!resolvedPath.startsWith(UPLOADS_ROOT)) {
			throw new Error('Invalid file path - path traversal detected');
		}

		// Additional security check - ensure file exists and is readable
		if (!fs.existsSync(resolvedPath)) {
			throw new Error('File does not exist');
		}

		const result = await cloudinary.v2.uploader.upload(resolvedPath, {
			folder: 'bartendershub/avatars',
			width: 200,
			height: 200,
			crop: 'fill',
			gravity: 'face',
			quality: 'auto:best',
			resource_type: 'image',
			allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
		});

		// Delete the local file after upload
		fs.unlinkSync(resolvedPath);

		return {
			url: result.secure_url,
			publicId: result.public_id,
		};
	} catch (error) {
		// Delete the local file if upload fails
		try {
			const resolvedPath = path.resolve(imagePath);
			if (
				resolvedPath.startsWith(UPLOADS_ROOT) &&
				fs.existsSync(resolvedPath)
			) {
				fs.unlinkSync(resolvedPath);
			}
		} catch (validationError) {
			console.error(
				'Error validating file path during cleanup:',
				validationError,
			);
		}
		throw error;
	}
};

// Optimize image URL for different use cases
export const optimizeImageUrl = (publicId, options = {}) => {
	if (!publicId) return null;

	const {
		width = 400,
		height = 300,
		quality = 'auto',
		format = 'auto',
		crop = 'fill',
	} = options;

	return cloudinary.v2.url(publicId, {
		width,
		height,
		crop,
		quality,
		format,
		fetch_format: 'auto',
		flags: 'progressive',
	});
};

// Generate different image sizes for responsive design
export const generateImageVariants = (publicId) => {
	if (!publicId) return {};

	return {
		thumbnail: optimizeImageUrl(publicId, { width: 150, height: 150 }),
		small: optimizeImageUrl(publicId, { width: 300, height: 200 }),
		medium: optimizeImageUrl(publicId, { width: 600, height: 400 }),
		large: optimizeImageUrl(publicId, { width: 1200, height: 800 }),
		original: cloudinary.v2.url(publicId, {
			quality: 'auto',
			format: 'auto',
		}),
	};
};
