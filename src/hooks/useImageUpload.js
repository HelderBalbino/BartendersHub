import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const useImageUpload = (options = {}) => {
	const {
		maxSize = 5 * 1024 * 1024, // 5MB default
		allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
		folder = 'bartendershub', // Cloudinary folder
		onUploadStart,
		onUploadComplete,
		onUploadError,
	} = options;

	const [uploading, setUploading] = useState(false);
	const [preview, setPreview] = useState(null);
	const [file, setFile] = useState(null);
	const [uploadedUrl, setUploadedUrl] = useState(null);

	const validateFile = useCallback(
		(file) => {
			if (!file) return false;

			// Check file type
			if (!allowedTypes.includes(file.type)) {
				toast.error(
					'Please select a valid image file (JPEG, PNG, or WebP)',
				);
				return false;
			}

			// Check file size
			if (file.size > maxSize) {
				toast.error(
					`Image size must be less than ${Math.round(
						maxSize / 1024 / 1024,
					)}MB`,
				);
				return false;
			}

			return true;
		},
		[allowedTypes, maxSize],
	);

	// Upload to Cloudinary
	const uploadToCloudinary = useCallback(async (file) => {
		if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
			toast.error('Cloudinary configuration is missing');
			return null;
		}

		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
		formData.append('folder', folder);
		formData.append('quality', 'auto:good');
		formData.append('format', 'auto');

		try {
			const response = await fetch(CLOUDINARY_UPLOAD_URL, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			const data = await response.json();
			return {
				url: data.secure_url,
				publicId: data.public_id,
				format: data.format,
				width: data.width,
				height: data.height,
			};
		} catch (error) {
			console.error('Cloudinary upload error:', error);
			throw error;
		}
	}, [folder]);

	const handleFileSelect = useCallback(
		(selectedFile) => {
			if (!validateFile(selectedFile)) return;

			setFile(selectedFile);
			setPreview(URL.createObjectURL(selectedFile));
			
			if (onUploadStart) {
				onUploadStart(selectedFile);
			}
		},
		[validateFile, onUploadStart],
	);

	const uploadImage = useCallback(async () => {
		if (!file) {
			toast.error('Please select a file first');
			return null;
		}

		setUploading(true);

		try {
			const result = await uploadToCloudinary(file);
			setUploadedUrl(result.url);
			onUploadComplete?.(result);
			toast.success('Image uploaded successfully!');
			return result;
		} catch (error) {
			onUploadError?.(error);
			toast.error('Failed to upload image. Please try again.');
			return null;
		} finally {
			setUploading(false);
		}
	}, [file, uploadToCloudinary, onUploadComplete, onUploadError]);

	const clearFile = useCallback(() => {
		if (preview) {
			URL.revokeObjectURL(preview);
		}
		setFile(null);
		setPreview(null);
		setUploadedUrl(null);
		setUploading(false);
	}, [preview]);

	return {
		file,
		preview,
		uploading,
		uploadedUrl,
		handleFileSelect,
		clearFile,
		uploadImage,
		validateFile,
	};
};

export default useImageUpload;
