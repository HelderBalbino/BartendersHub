import { useState } from 'react';
import { Link } from 'react-router-dom';

const AddCocktailSection = () => {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		ingredients: [''],
		instructions: [''],
		difficulty: 'beginner',
		prepTime: '',
		servings: '1',
		glassType: '',
		garnish: '',
		image: null,
		imagePreview: null,
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData((prev) => ({
				...prev,
				image: file,
				imagePreview: URL.createObjectURL(file),
			}));
		}
	};

	const handleArrayChange = (index, value, field) => {
		const newArray = [...formData[field]];
		newArray[index] = value;
		setFormData((prev) => ({
			...prev,
			[field]: newArray,
		}));
	};

	const addArrayField = (field) => {
		setFormData((prev) => ({
			...prev,
			[field]: [...prev[field], ''],
		}));
	};

	const removeArrayField = (index, field) => {
		const newArray = formData[field].filter((_, i) => i !== index);
		setFormData((prev) => ({
			...prev,
			[field]: newArray,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission here
		console.log('Cocktail submitted:', formData);
		// You can add API call here to save the cocktail
		alert('Cocktail recipe submitted successfully!');
	};

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
					<div className='w-24 h-0.5 bg-yellow-400 mx-auto mb-4'></div>
					<p className='text-gray-400 text-lg font-light italic max-w-2xl mx-auto'>
						"Share your mixology masterpiece with the world. Every
						great cocktail tells a story."
					</p>
				</div>

				{/* Form Container */}
				<div className='relative border border-yellow-400/40 p-8 md:p-12 bg-black/30 backdrop-blur-sm'>
					{/* Art Deco corner decorations */}
					<div className='absolute -top-1 -left-1 w-8 h-8 border-l-2 border-t-2 border-yellow-400'></div>
					<div className='absolute -top-1 -right-1 w-8 h-8 border-r-2 border-t-2 border-yellow-400'></div>
					<div className='absolute -bottom-1 -left-1 w-8 h-8 border-l-2 border-b-2 border-yellow-400'></div>
					<div className='absolute -bottom-1 -right-1 w-8 h-8 border-r-2 border-b-2 border-yellow-400'></div>

					<form onSubmit={handleSubmit} className='space-y-8'>
						{/* Cocktail Name */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
									Cocktail Name *
								</label>
								<input
									type='text'
									name='name'
									value={formData.name}
									onChange={handleInputChange}
									className='w-full bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500'
									placeholder='Enter cocktail name'
									required
								/>
							</div>

							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
									Difficulty Level
								</label>
								<select
									name='difficulty'
									value={formData.difficulty}
									onChange={handleInputChange}
									className='w-full bg-black/50 border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300'
								>
									<option value='beginner'>Beginner</option>
									<option value='intermediate'>
										Intermediate
									</option>
									<option value='advanced'>Advanced</option>
									<option value='expert'>Expert</option>
								</select>
							</div>
						</div>

						{/* Description */}
						<div>
							<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
								Description *
							</label>
							<textarea
								name='description'
								value={formData.description}
								onChange={handleInputChange}
								rows={4}
								className='w-full bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500 resize-none'
								placeholder='Tell the story of your cocktail...'
								required
							/>
						</div>

						{/* Cocktail Details */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
									Prep Time (minutes)
								</label>
								<input
									type='number'
									name='prepTime'
									value={formData.prepTime}
									onChange={handleInputChange}
									className='w-full bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300'
									placeholder='5'
									min='1'
								/>
							</div>

							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
									Servings
								</label>
								<input
									type='number'
									name='servings'
									value={formData.servings}
									onChange={handleInputChange}
									className='w-full bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300'
									min='1'
								/>
							</div>

							<div>
								<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
									Glass Type
								</label>
								<input
									type='text'
									name='glassType'
									value={formData.glassType}
									onChange={handleInputChange}
									className='w-full bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500'
									placeholder='Martini, Rocks, Coupe...'
								/>
							</div>
						</div>

						{/* Ingredients */}
						<div>
							<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
								Ingredients *
							</label>
							<div className='space-y-3'>
								{formData.ingredients.map(
									(ingredient, index) => (
										<div key={index} className='flex gap-3'>
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
												placeholder='2 oz Gin, 1 oz Vermouth...'
												required
											/>
											{formData.ingredients.length >
												1 && (
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
									),
								)}
								<button
									type='button'
									onClick={() => addArrayField('ingredients')}
									className='text-yellow-400 hover:text-yellow-300 text-sm font-light tracking-wide uppercase'
								>
									+ Add Ingredient
								</button>
							</div>
						</div>

						{/* Instructions */}
						<div>
							<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
								Instructions *
							</label>
							<div className='space-y-3'>
								{formData.instructions.map(
									(instruction, index) => (
										<div key={index} className='flex gap-3'>
											<div className='flex-shrink-0 w-8 h-8 bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-sm font-light'>
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
												placeholder='Describe the step...'
												required
											/>
											{formData.instructions.length >
												1 && (
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
								value={formData.garnish}
								onChange={handleInputChange}
								className='w-full bg-transparent border border-yellow-400/30 text-white px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder-gray-500'
								placeholder='Lemon twist, Cherry, Olive...'
							/>
						</div>

						{/* Image Upload */}
						<div>
							<label className='block text-yellow-400 text-sm font-light tracking-wide uppercase mb-3'>
								Cocktail Image
							</label>
							<div className='border-2 border-dashed border-yellow-400/30 hover:border-yellow-400/60 transition-colors duration-300 p-8 text-center'>
								{formData.imagePreview ? (
									<div className='space-y-4'>
										<img
											src={formData.imagePreview}
											alt='Cocktail preview'
											className='mx-auto max-w-full h-48 object-cover border border-yellow-400/30'
										/>
										<button
											type='button'
											onClick={() =>
												setFormData((prev) => ({
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

						{/* Submit Button */}
						<div className='flex justify-center pt-8'>
							<button
								type='submit'
								className='group relative bg-yellow-400 text-black font-light py-4 px-12 border-2 border-yellow-400 transition-all duration-500 hover:bg-black hover:text-yellow-400 tracking-[0.15em] uppercase text-sm shadow-2xl'
							>
								{/* Art Deco corners */}
								<div className='absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-400'></div>
								<div className='absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-400'></div>
								<div className='absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-400'></div>
								<div className='absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-400'></div>

								<span className='relative z-10 flex items-center gap-3'>
									<span>🍸</span>
									<span>Submit Recipe</span>
								</span>
							</button>
						</div>
					</form>
				</div>

				{/* Back to Home */}
				<div className='text-center mt-12'>
					<Link
						to='/'
						className='inline-flex items-center text-gray-400 text-sm hover:text-yellow-400 transition-colors duration-300 group'
					>
						<span className='mr-2 group-hover:-translate-x-1 transition-transform duration-300'>
							←
						</span>
						Back to the Main Hall
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

export default AddCocktailSection;
