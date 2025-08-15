import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

// Components
import ArtDecoHeader from '../ui/ArtDeco/ArtDecoHeader';
import ArtDecoCard from '../ui/ArtDeco/ArtDecoCard';
import ArtDecoSeparator from '../ui/ArtDeco/ArtDecoSeparator';
import LoadingState from '../ui/States/LoadingState';
import FormActions from '../ui/Forms/FormActions';

// Form Components
import BasicInfoForm from './CocktailForm/BasicInfoForm';
import IngredientsForm from './CocktailForm/IngredientsForm';
import InstructionsForm from './CocktailForm/InstructionsForm';
import ImageAndTagsForm from './CocktailForm/ImageAndTagsForm';
import SubmitButton from './FormActions/SubmitButton';

// Hooks
import { useCreateCocktail } from '../../hooks/useCocktails';
import {
	useFormValidation,
	validationRules,
} from '../../hooks/useFormValidation';
import { useImageUpload } from '../../hooks/useImageUpload';

const AddCocktailSection = () => {
	const navigate = useNavigate();
	const createCocktailMutation = useCreateCocktail();

	// Initialize image upload hook
	const {
		preview: imagePreview,
		uploading: imageUploading,
		handleFileSelect,
		clearFile: clearImage,
		uploadImage,
	} = useImageUpload({
		folder: 'cocktails',
		onUploadComplete: (result) => {
			console.log('Image uploaded successfully:', result);
		},
		onUploadError: (error) => {
			console.error('Image upload failed:', error);
		},
	});

	const initialValues = {
		name: '',
		description: '',
		ingredients: [''],
		instructions: [''],
		difficulty: 'beginner',
		prepTime: '',
		servings: '1',
		glassType: '',
		garnish: '',
		tags: [''],
		imageUrl: null, // Store the Cloudinary URL instead of file
	};

	const validationSchema = {
		name: [
			validationRules.required,
			validationRules.minLength(3),
			validationRules.maxLength(100),
		],
		description: [
			validationRules.required,
			validationRules.minLength(10),
			validationRules.maxLength(500),
		],
		ingredients: [validationRules.arrayMinLength(1)],
		instructions: [validationRules.arrayMinLength(1)],
		prepTime: [validationRules.required],
		glassType: [validationRules.required],
	};

	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		validateAll,
		setValues,
	} = useFormValidation(initialValues, validationSchema);

	// Image handling with Cloudinary
	const handleImageChange = async (file) => {
		// Select the file and show preview
		handleFileSelect(file);

		// Auto-upload to Cloudinary
		try {
			const result = await uploadImage();
			if (result && result.url) {
				setValues((prev) => ({
					...prev,
					imageUrl: result.url,
				}));
			}
		} catch (error) {
			console.error('Failed to upload image:', error);
		}
	};

	const handleImageRemove = () => {
		clearImage();
		setValues((prev) => ({
			...prev,
			imageUrl: null,
		}));
	};

	// Array field handlers
	const handleIngredientsChange = (newIngredients) => {
		setValues((prev) => ({
			...prev,
			ingredients: newIngredients,
		}));
	};

	const handleInstructionsChange = (newInstructions) => {
		setValues((prev) => ({
			...prev,
			instructions: newInstructions,
		}));
	};

	const handleTagsChange = (newTags) => {
		setValues((prev) => ({
			...prev,
			tags: newTags,
		}));
	};

	// Form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateAll()) {
			toast.error('Please fix the errors in the form');
			return;
		}

		// Filter out empty array items
		const filteredData = {
			...values,
			ingredients: values.ingredients.filter((item) => item.trim()),
			instructions: values.instructions.filter((item) => item.trim()),
			tags: values.tags.filter((item) => item.trim()),
		};

		// Validate that we still have required items
		if (filteredData.ingredients.length === 0) {
			toast.error('Please add at least one ingredient');
			return;
		}

		if (filteredData.instructions.length === 0) {
			toast.error('Please add at least one instruction step');
			return;
		}

		try {
			const cocktailData = {
				...filteredData,
				image: values.imageUrl, // Send Cloudinary URL instead of file
			};

			const result = await createCocktailMutation.mutateAsync(
				cocktailData,
			);
			// Expect backend shape { success, data: {...} } or { success, cocktail }
			let created = null;
			if (result?.data) created = result.data;
			else if (result?.cocktail) created = result.cocktail;
			else if (result?.id || result?._id) created = result;

			if (!created) {
				toast.error('Cocktail created but response missing data');
				return navigate('/cocktails');
			}

			toast.success('Cocktail recipe created successfully!');
			const newId = created.slug || created._id || created.id;
			if (newId) navigate(`/cocktails/${newId}`);
			else navigate('/cocktails');
		} catch (error) {
			console.error('Failed to create cocktail:', error);
		}
	};

	if (createCocktailMutation.isLoading) {
		return (
			<LoadingState
				fullScreen
				size='large'
				text='Crafting your signature cocktail...'
			/>
		);
	}

	return (
		<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-20 overflow-hidden'>
			{/* Art Deco Background Pattern */}
			<div className='absolute inset-0 opacity-8'>
				{/* Golden gradient overlay */}
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-400/5'></div>

				{/* Geometric Art Deco elements */}
				<div className='absolute top-16 left-16 w-48 h-48 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute bottom-16 right-16 w-40 h-40 border border-yellow-400/20 rotate-45'></div>
				<div className='absolute top-1/2 left-16 w-32 h-32 border border-yellow-400/15 rotate-45'></div>
				<div className='absolute top-1/4 right-16 w-36 h-36 border border-yellow-400/15 rotate-45'></div>

				{/* Vertical decorative lines */}
				<div className='absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-yellow-400/20 via-yellow-400/5 to-yellow-400/20'></div>
				<div className='absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-yellow-400/20 via-yellow-400/5 to-yellow-400/20'></div>
			</div>

			{/* Main Content */}
			<div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Header */}
				<ArtDecoHeader
					title='Craft Your Signature'
					subtitle='Share your masterpiece with the world'
					emoji='🍸'
					size='large'
				/>

				{/* Form Container */}
				<ArtDecoCard className='p-8'>
					<form
						onSubmit={handleSubmit}
						className='grid grid-cols-1 lg:grid-cols-2 gap-8'
					>
						{/* Left Column */}
						<div className='space-y-6'>
							<BasicInfoForm
								values={values}
								errors={errors}
								touched={touched}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</div>

						{/* Right Column */}
						<div className='space-y-6'>
							<IngredientsForm
								ingredients={values.ingredients}
								onChange={handleIngredientsChange}
								error={errors.ingredients}
								touched={touched.ingredients}
							/>

							<InstructionsForm
								instructions={values.instructions}
								onChange={handleInstructionsChange}
								error={errors.instructions}
								touched={touched.instructions}
							/>

							<ImageAndTagsForm
								imagePreview={imagePreview}
								onImageChange={handleImageChange}
								onImageRemove={handleImageRemove}
								tags={values.tags}
								onTagsChange={handleTagsChange}
								uploading={imageUploading}
							/>
						</div>

						{/* Submit Button - Full Width */}
						<FormActions className='col-span-1 lg:col-span-2'>
							<SubmitButton
								isLoading={createCocktailMutation.isLoading}
								disabled={createCocktailMutation.isLoading}
							/>
						</FormActions>
					</form>
				</ArtDecoCard>

				{/* Back to Cocktails */}
				<div className='text-center mt-12'>
					<Link
						to='/cocktails'
						className='inline-flex items-center text-gray-400 text-sm hover:text-yellow-400 transition-colors duration-300 group'
					>
						<span className='mr-2 group-hover:-translate-x-1 transition-transform duration-300'>
							←
						</span>
						Back to Cocktails
					</Link>
				</div>

				{/* Bottom decorative element */}
				<ArtDecoSeparator variant='diamond' className='mt-8' />
			</div>
		</section>
	);
};

AddCocktailSection.propTypes = {};

export default AddCocktailSection;
