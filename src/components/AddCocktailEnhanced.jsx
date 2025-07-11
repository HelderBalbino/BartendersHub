import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCreateCocktail } from '../hooks/useCocktails';
import { useFormValidation, validationRules } from '../hooks/useFormValidation';
import LoadingSpinner from './LoadingSpinner';

const AddCocktailEnhanced = () => {
	const navigate = useNavigate();
	const createCocktailMutation = useCreateCocktail();

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
		image: null,
		imagePreview: null,
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

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				toast.error('Please select a valid image file');
				return;
			}

			// Validate file size (5MB limit)
			if (file.size > 5 * 1024 * 1024) {
				toast.error('Image size must be less than 5MB');
				return;
			}

			setValues((prev) => ({
				...prev,
				image: file,
				imagePreview: URL.createObjectURL(file),
			}));
		}
	};

	const handleArrayChange = (index, value, field) => {
		const newArray = [...values[field]];
		newArray[index] = value;
		setValues((prev) => ({
			...prev,
			[field]: newArray,
		}));
	};

	const addArrayField = (field) => {
		setValues((prev) => ({
			...prev,
			[field]: [...prev[field], ''],
		}));
	};

	const removeArrayField = (index, field) => {
		if (values[field].length <= 1) {
			toast.error(`You must have at least one ${field.slice(0, -1)}`);
			return;
		}

		const newArray = values[field].filter((_, i) => i !== index);
		setValues((prev) => ({
			...prev,
			[field]: newArray,
		}));
	};

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
			await createCocktailMutation.mutateAsync(filteredData);
			toast.success('Cocktail recipe created successfully!');
			navigate('/cocktails');
		} catch (error) {
			// Error is handled by the mutation hook
			console.error('Failed to create cocktail:', error);
		}
	};

	if (createCocktailMutation.isLoading) {
		return (
			<section className='relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
				<LoadingSpinner
					size='large'
					text='Crafting your signature cocktail...'
				/>
			</section>
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
				{/* Header Section */}
				<div className='text-center mb-12'>
					<div className='flex items-center justify-center mb-6'>
						<div className='text-6xl md:text-7xl text-yellow-400 mb-3 filter drop-shadow-lg'>
							🍸
						</div>
					</div>

					<h1 className='text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4 tracking-[0.2em] uppercase'>
						Craft Your Signature
					</h1>
					<div className='w-20 h-0.5 bg-yellow-400 mx-auto mb-4'></div>
					<p className='text-gray-400 text-lg font-light italic'>
						Share your masterpiece with the world
					</p>
				</div>

				{/* Form Container */}
				<div className='relative border border-yellow-400/30 p-8 bg-black/20 backdrop-blur-sm'>
					{/* Art Deco corner decorations */}
					<div className='absolute -top-1 -left-1 w-8 h-8 border-l-2 border-t-2 border-yellow-400'></div>
					<div className='absolute -top-1 -right-1 w-8 h-8 border-r-2 border-t-2 border-yellow-400'></div>
					<div className='absolute -bottom-1 -left-1 w-8 h-8 border-l-2 border-b-2 border-yellow-400'></div>
					<div className='absolute -bottom-1 -right-1 w-8 h-8 border-r-2 border-b-2 border-yellow-400'></div>

					<form
						onSubmit={handleSubmit}
						className='grid grid-cols-1 lg:grid-cols-2 gap-8'
					>
						{/* Left Column */}
						<div className='space-y-6'>
							{/* Cocktail Name */}
							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
									Cocktail Name *
								</label>
								<input
									type='text'
									name='name'
									value={values.name}
									onChange={handleChange}
									onBlur={handleBlur}
									className={`w-full bg-transparent border ${
										touched.name && errors.name
											? 'border-red-400'
											: 'border-yellow-400/30'
									} text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500`}
									placeholder='The Golden Fizz'
								/>
								{touched.name && errors.name && (
									<p className='mt-1 text-red-400 text-xs'>
										{errors.name}
									</p>
								)}
							</div>

							{/* Description */}
							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
									Description *
								</label>
								<textarea
									name='description'
									value={values.description}
									onChange={handleChange}
									onBlur={handleBlur}
									rows={4}
									className={`w-full bg-transparent border ${
										touched.description &&
										errors.description
											? 'border-red-400'
											: 'border-yellow-400/30'
									} text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500 resize-none`}
									placeholder='A sophisticated blend of gin and elderflower...'
								/>
								{touched.description && errors.description && (
									<p className='mt-1 text-red-400 text-xs'>
										{errors.description}
									</p>
								)}
							</div>

							{/* Cocktail Details Grid */}
							<div className='grid grid-cols-2 gap-4'>
								{/* Difficulty */}
								<div>
									<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
										Difficulty
									</label>
									<select
										name='difficulty'
										value={values.difficulty}
										onChange={handleChange}
										className='w-full bg-black border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300'
									>
										<option value='beginner'>
											Beginner
										</option>
										<option value='intermediate'>
											Intermediate
										</option>
										<option value='advanced'>
											Advanced
										</option>
										<option value='expert'>Expert</option>
									</select>
								</div>

								{/* Prep Time */}
								<div>
									<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
										Prep Time *
									</label>
									<input
										type='text'
										name='prepTime'
										value={values.prepTime}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`w-full bg-transparent border ${
											touched.prepTime && errors.prepTime
												? 'border-red-400'
												: 'border-yellow-400/30'
										} text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500`}
										placeholder='5 min'
									/>
									{touched.prepTime && errors.prepTime && (
										<p className='mt-1 text-red-400 text-xs'>
											{errors.prepTime}
										</p>
									)}
								</div>

								{/* Servings */}
								<div>
									<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
										Servings
									</label>
									<input
										type='number'
										name='servings'
										value={values.servings}
										onChange={handleChange}
										min='1'
										max='20'
										className='w-full bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300'
									/>
								</div>

								{/* Glass Type */}
								<div>
									<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
										Glass Type *
									</label>
									<input
										type='text'
										name='glassType'
										value={values.glassType}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`w-full bg-transparent border ${
											touched.glassType &&
											errors.glassType
												? 'border-red-400'
												: 'border-yellow-400/30'
										} text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500`}
										placeholder='Martini Glass'
									/>
									{touched.glassType && errors.glassType && (
										<p className='mt-1 text-red-400 text-xs'>
											{errors.glassType}
										</p>
									)}
								</div>
							</div>

							{/* Garnish */}
							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
									Garnish
								</label>
								<input
									type='text'
									name='garnish'
									value={values.garnish}
									onChange={handleChange}
									className='w-full bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500'
									placeholder='Lemon twist, Cherry, Olive...'
								/>
							</div>
						</div>

						{/* Right Column */}
						<div className='space-y-6'>
							{/* Ingredients */}
							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
									Ingredients *
								</label>
								{values.ingredients.map((ingredient, index) => (
									<div
										key={index}
										className='flex gap-2 mb-3'
									>
										<input
											type='text'
											value={ingredient}
											onChange={(e) =>
												handleArrayChange(
													index,
													e.target.value,
													'ingredients',
												)
											}
											className='flex-1 bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500'
											placeholder={`Ingredient ${
												index + 1
											}`}
										/>
										{values.ingredients.length > 1 && (
											<button
												type='button'
												onClick={() =>
													removeArrayField(
														index,
														'ingredients',
													)
												}
												className='text-red-400 hover:text-red-300 px-3 py-2 border border-red-400/30 hover:border-red-400 transition-colors duration-300'
											>
												×
											</button>
										)}
									</div>
								))}
								<button
									type='button'
									onClick={() => addArrayField('ingredients')}
									className='text-yellow-400 hover:text-yellow-300 text-sm font-light tracking-wide uppercase'
								>
									+ Add Ingredient
								</button>
								{touched.ingredients && errors.ingredients && (
									<p className='mt-1 text-red-400 text-xs'>
										{errors.ingredients}
									</p>
								)}
							</div>

							{/* Instructions */}
							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
									Instructions *
								</label>
								{values.instructions.map(
									(instruction, index) => (
										<div
											key={index}
											className='flex gap-2 mb-3'
										>
											<div className='flex-shrink-0 w-8 h-12 flex items-center justify-center border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-sm font-bold'>
												{index + 1}
											</div>
											<textarea
												value={instruction}
												onChange={(e) =>
													handleArrayChange(
														index,
														e.target.value,
														'instructions',
													)
												}
												rows={2}
												className='flex-1 bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500 resize-none'
												placeholder={`Step ${
													index + 1
												}`}
											/>
											{values.instructions.length > 1 && (
												<button
													type='button'
													onClick={() =>
														removeArrayField(
															index,
															'instructions',
														)
													}
													className='text-red-400 hover:text-red-300 px-3 py-2 border border-red-400/30 hover:border-red-400 transition-colors duration-300'
												>
													×
												</button>
											)}
										</div>
									),
								)}
								<button
									type='button'
									onClick={() =>
										addArrayField('instructions')
									}
									className='text-yellow-400 hover:text-yellow-300 text-sm font-light tracking-wide uppercase'
								>
									+ Add Step
								</button>
								{touched.instructions &&
									errors.instructions && (
										<p className='mt-1 text-red-400 text-xs'>
											{errors.instructions}
										</p>
									)}
							</div>

							{/* Tags */}
							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
									Tags
								</label>
								{values.tags.map((tag, index) => (
									<div
										key={index}
										className='flex gap-2 mb-3'
									>
										<input
											type='text'
											value={tag}
											onChange={(e) =>
												handleArrayChange(
													index,
													e.target.value,
													'tags',
												)
											}
											className='flex-1 bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500'
											placeholder={`Tag ${index + 1}`}
										/>
										{values.tags.length > 1 && (
											<button
												type='button'
												onClick={() =>
													removeArrayField(
														index,
														'tags',
													)
												}
												className='text-red-400 hover:text-red-300 px-3 py-2 border border-red-400/30 hover:border-red-400 transition-colors duration-300'
											>
												×
											</button>
										)}
									</div>
								))}
								<button
									type='button'
									onClick={() => addArrayField('tags')}
									className='text-yellow-400 hover:text-yellow-300 text-sm font-light tracking-wide uppercase'
								>
									+ Add Tag
								</button>
							</div>

							{/* Image Upload */}
							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
									Cocktail Image
								</label>
								<div className='border-2 border-dashed border-yellow-400/30 hover:border-yellow-400/60 transition-colors duration-300 p-8 text-center'>
									{values.imagePreview ? (
										<div className='space-y-4'>
											<img
												src={values.imagePreview}
												alt='Cocktail preview'
												className='mx-auto max-w-full h-48 object-cover border border-yellow-400/30'
											/>
											<button
												type='button'
												onClick={() =>
													setValues((prev) => ({
														...prev,
														image: null,
														imagePreview: null,
													}))
												}
												className='text-yellow-400 hover:text-yellow-300 text-sm font-light tracking-wide uppercase'
											>
												Remove Image
											</button>
										</div>
									) : (
										<div className='space-y-4'>
											<div className='text-4xl text-yellow-400/60'>
												📸
											</div>
											<div>
												<input
													type='file'
													accept='image/*'
													onChange={handleImageChange}
													className='hidden'
													id='cocktail-image'
												/>
												<label
													htmlFor='cocktail-image'
													className='cursor-pointer inline-block bg-transparent text-yellow-400 font-light px-6 py-3 border border-yellow-400/60 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 tracking-wide uppercase text-sm'
												>
													Upload Image
												</label>
											</div>
											<p className='text-gray-400 text-sm'>
												PNG, JPG up to 5MB
											</p>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Submit Button - Full Width */}
						<div className='col-span-1 lg:col-span-2 flex justify-center pt-8'>
							<button
								type='submit'
								disabled={createCocktailMutation.isLoading}
								className='group relative bg-yellow-400 text-black font-light py-4 px-12 border-2 border-yellow-400 transition-all duration-500 hover:bg-black hover:text-yellow-400 tracking-[0.15em] uppercase text-sm shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{/* Art Deco corners */}
								<div className='absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-400'></div>
								<div className='absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-400'></div>
								<div className='absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-400'></div>
								<div className='absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-400'></div>

								<span className='relative z-10 flex items-center gap-3'>
									{createCocktailMutation.isLoading ? (
										<>
											<div className='w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin'></div>
											<span>Creating...</span>
										</>
									) : (
										<>
											<span>🍸</span>
											<span>Submit Recipe</span>
										</>
									)}
								</span>
							</button>
						</div>
					</form>
				</div>

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
				<div className='flex items-center justify-center mt-8'>
					<div className='w-16 h-0.5 bg-gradient-to-r from-transparent to-yellow-400'></div>
					<div className='w-3 h-3 border border-yellow-400 rotate-45 bg-yellow-400/20 mx-4'></div>
					<div className='w-16 h-0.5 bg-gradient-to-l from-transparent to-yellow-400'></div>
				</div>
			</div>
		</section>
	);
};

export default AddCocktailEnhanced;
