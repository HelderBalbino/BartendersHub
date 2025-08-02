import { useState } from 'react';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

const ImageUpload = ({
	preview,
	onChange,
	onRemove,
	className = '',
	maxSize = 5 * 1024 * 1024, // 5MB default
	acceptedTypes = ['image/*'],
	placeholder = 'Upload Image',
	uploading = false,
}) => {
	const [isDragOver, setIsDragOver] = useState(false);

	const handleFileChange = (file) => {
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			toast.error('Please select a valid image file');
			return;
		}

		// Validate file size
		if (file.size > maxSize) {
			toast.error(
				`Image size must be less than ${Math.round(
					maxSize / 1024 / 1024,
				)}MB`,
			);
			return;
		}

		onChange(file);
	};

	const handleInputChange = (e) => {
		const file = e.target.files[0];
		handleFileChange(file);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);

		const file = e.dataTransfer.files[0];
		handleFileChange(file);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	return (
		<div className={className}>
			<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
				{placeholder}
			</label>

			<div
				className={`border-2 border-dashed transition-colors duration-300 p-8 text-center ${
					isDragOver
						? 'border-yellow-400 bg-yellow-400/10'
						: 'border-yellow-400/30 hover:border-yellow-400/60'
				} ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
			>
				{uploading ? (
					<div className='space-y-4'>
						<div className='text-4xl text-yellow-400/60'>⏳</div>
						<div className='text-yellow-400 font-light tracking-wide uppercase text-sm'>
							Uploading to cloud...
						</div>
						<div className='text-gray-400 text-xs'>
							Please wait while we process your image
						</div>
					</div>
				) : preview ? (
					<div className='space-y-4'>
						<img
							src={preview}
							alt='Preview'
							className='mx-auto max-w-full h-48 object-cover border border-yellow-400/30'
						/>
						<button
							type='button'
							onClick={onRemove}
							className='text-yellow-400 hover:text-yellow-300 text-sm font-light tracking-wide uppercase'
						>
							Remove Image
						</button>
					</div>
				) : (
					<div className='space-y-4'>
						<div className='text-4xl text-yellow-400/60'>📸</div>
						<div>
							<input
								type='file'
								accept={acceptedTypes.join(',')}
								onChange={handleInputChange}
								className='hidden'
								id='image-upload'
							/>
							<label
								htmlFor='image-upload'
								className='cursor-pointer inline-block bg-transparent text-yellow-400 font-light px-6 py-3 border border-yellow-400/60 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 tracking-wide uppercase text-sm'
							>
								{placeholder}
							</label>
						</div>
						<p className='text-gray-400 text-sm'>
							PNG, JPG up to {Math.round(maxSize / 1024 / 1024)}MB
						</p>
						<p className='text-gray-400 text-xs'>
							Or drag and drop an image here
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

ImageUpload.propTypes = {
	preview: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	className: PropTypes.string,
	maxSize: PropTypes.number,
	acceptedTypes: PropTypes.arrayOf(PropTypes.string),
	placeholder: PropTypes.string,
	uploading: PropTypes.bool,
};

export default ImageUpload;
