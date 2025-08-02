import PropTypes from 'prop-types';
import ImageUpload from '../../ui/Forms/ImageUpload';
import TagInput from '../../ui/Forms/TagInput';
import FormSection from '../../ui/Forms/FormSection';

const ImageAndTagsForm = ({
	imagePreview,
	onImageChange,
	onImageRemove,
	tags,
	onTagsChange,
	uploading = false,
}) => {
	return (
		<FormSection title='Image & Tags'>
			<ImageUpload
				preview={imagePreview}
				onChange={onImageChange}
				onRemove={onImageRemove}
				placeholder='Cocktail Image'
				uploading={uploading}
			/>

			<div>
				<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
					Tags
				</label>
				<TagInput
					items={tags}
					onChange={onTagsChange}
					placeholder='Tag'
					fieldName='tags'
					minItems={0}
				/>
			</div>
		</FormSection>
	);
};

ImageAndTagsForm.propTypes = {
	imagePreview: PropTypes.string,
	onImageChange: PropTypes.func.isRequired,
	onImageRemove: PropTypes.func.isRequired,
	tags: PropTypes.array.isRequired,
	onTagsChange: PropTypes.func.isRequired,
	uploading: PropTypes.bool,
};

export default ImageAndTagsForm;
