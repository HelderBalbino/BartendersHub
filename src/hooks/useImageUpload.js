import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useImageUpload = (options = {}) => {
	const {
		maxSize = 5 * 1024 * 1024, // 5MB default
		allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
		onUploadStart,
		onUploadComplete,
		onUploadError,
	} = options;

	const [uploading, setUploading] = useState(false);
	const [preview, setPreview] = useState(null);
	const [file, setFile] = useState(null);

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

	const clearFile = useCallback(() => {
		if (preview) {
			URL.revokeObjectURL(preview);
		}
		setFile(null);
		setPreview(null);
		setUploading(false);
	}, [preview]);

	const uploadFile = useCallback(
		async (uploadFn) => {
			if (!file) return null;

			setUploading(true);
			try {
				const result = await uploadFn(file);
				if (onUploadComplete) {
					onUploadComplete(result);
				}
				return result;
			} catch (error) {
				if (onUploadError) {
					onUploadError(error);
				} else {
					toast.error('Failed to upload image');
				}
				throw error;
			} finally {
				setUploading(false);
			}
		},
		[file, onUploadComplete, onUploadError],
	);

	return {
		file,
		preview,
		uploading,
		handleFileSelect,
		clearFile,
		uploadFile,
		validateFile,
	};
};

export default useImageUpload;
