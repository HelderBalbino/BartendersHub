import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure cloudinary
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to cloudinary
export const uploadImage = async (imagePath, folder = 'cocktails') => {
	try {
		const result = await cloudinary.v2.uploader.upload(imagePath, {
			folder: `bartendershub/${folder}`,
			width: 800,
			height: 600,
			crop: 'limit',
			quality: 'auto:best',
		});

		// Delete the local file after upload
		fs.unlinkSync(imagePath);

		return {
			url: result.secure_url,
			publicId: result.public_id,
		};
	} catch (error) {
		// Delete the local file if upload fails
		if (fs.existsSync(imagePath)) {
			fs.unlinkSync(imagePath);
		}
		throw error;
	}
};

// Delete image from cloudinary
export const deleteImage = async (publicId) => {
	try {
		await cloudinary.v2.uploader.destroy(publicId);
	} catch (error) {
		console.error('Error deleting image from cloudinary:', error);
	}
};

// Upload avatar to cloudinary
export const uploadAvatar = async (imagePath) => {
	const UPLOADS_ROOT = path.resolve('/path/to/uploads'); // Define the safe root directory
	try {
		// Resolve and validate the imagePath
		const resolvedPath = fs.realpathSync(path.resolve(imagePath));
		if (!resolvedPath.startsWith(UPLOADS_ROOT)) {
			throw new Error('Invalid file path');
		}

		const result = await cloudinary.v2.uploader.upload(resolvedPath, {
			folder: 'bartendershub/avatars',
			width: 200,
			height: 200,
			crop: 'fill',
			gravity: 'face',
			quality: 'auto:best',
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
			const resolvedPath = fs.realpathSync(path.resolve(imagePath));
			if (resolvedPath.startsWith(UPLOADS_ROOT) && fs.existsSync(resolvedPath)) {
				fs.unlinkSync(resolvedPath);
			}
		} catch (validationError) {
			console.error('Error validating file path during cleanup:', validationError);
		}
		throw error;
	}
};
