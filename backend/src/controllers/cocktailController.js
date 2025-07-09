import Cocktail from '../models/Cocktail.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

// @desc    Get all cocktails
// @route   GET /api/cocktails
// @access  Public
export const getCocktails = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		// Build query
		let query = { isApproved: true };

		// Filter by category
		if (req.query.category) {
			query.category = req.query.category;
		}

		// Filter by difficulty
		if (req.query.difficulty) {
			query.difficulty = req.query.difficulty;
		}

		// Filter by alcohol content
		if (req.query.alcoholContent) {
			query.alcoholContent = req.query.alcoholContent;
		}

		// Search by name or description
		if (req.query.search) {
			query.$text = { $search: req.query.search };
		}

		// Sort options
		let sortBy = { createdAt: -1 };
		if (req.query.sortBy === 'rating') {
			// For rating, we'll need to use aggregation
			sortBy = { averageRating: -1 };
		} else if (req.query.sortBy === 'views') {
			sortBy = { views: -1 };
		} else if (req.query.sortBy === 'likes') {
			sortBy = { 'likes.length': -1 };
		}

		const cocktails = await Cocktail.find(query)
			.populate('createdBy', 'name username avatar isVerified')
			.sort(sortBy)
			.skip(skip)
			.limit(limit);

		const total = await Cocktail.countDocuments(query);

		res.status(200).json({
			success: true,
			count: cocktails.length,
			total,
			page,
			pages: Math.ceil(total / limit),
			data: cocktails,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Get single cocktail
// @route   GET /api/cocktails/:id
// @access  Public
export const getCocktail = async (req, res) => {
	try {
		const cocktail = await Cocktail.findById(req.params.id)
			.populate(
				'createdBy',
				'name username avatar isVerified speciality location',
			)
			.populate('comments.user', 'name username avatar isVerified')
			.populate('likes.user', 'name username avatar')
			.populate('ratings.user', 'name username avatar');

		if (!cocktail) {
			return res.status(404).json({
				success: false,
				message: 'Cocktail not found',
			});
		}

		// Increment view count
		await Cocktail.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

		res.status(200).json({
			success: true,
			data: cocktail,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Create new cocktail
// @route   POST /api/cocktails
// @access  Private
export const createCocktail = async (req, res) => {
	try {
		let imageData = {};

		// Handle image upload
		if (req.file) {
			try {
				imageData = await uploadImage(req.file.path, 'cocktails');
			} catch (uploadError) {
				return res.status(400).json({
					success: false,
					message: 'Error uploading image',
					error: uploadError.message,
				});
			}
		}

		const cocktailData = {
			...req.body,
			createdBy: req.user.id,
			image: imageData,
		};

		// Parse ingredients and instructions if they come as strings
		if (typeof cocktailData.ingredients === 'string') {
			cocktailData.ingredients = JSON.parse(cocktailData.ingredients);
		}
		if (typeof cocktailData.instructions === 'string') {
			cocktailData.instructions = JSON.parse(cocktailData.instructions);
		}

		const cocktail = await Cocktail.create(cocktailData);

		// Populate the created cocktail
		await cocktail.populate('createdBy', 'name username avatar isVerified');

		res.status(201).json({
			success: true,
			message: 'Cocktail created successfully',
			data: cocktail,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Update cocktail
// @route   PUT /api/cocktails/:id
// @access  Private
export const updateCocktail = async (req, res) => {
	try {
		let cocktail = await Cocktail.findById(req.params.id);

		if (!cocktail) {
			return res.status(404).json({
				success: false,
				message: 'Cocktail not found',
			});
		}

		// Make sure user is cocktail owner or admin
		if (
			cocktail.createdBy.toString() !== req.user.id &&
			!req.user.isAdmin
		) {
			return res.status(401).json({
				success: false,
				message: 'Not authorized to update this cocktail',
			});
		}

		// Handle new image upload
		if (req.file) {
			try {
				// Delete old image
				if (cocktail.image.publicId) {
					await deleteImage(cocktail.image.publicId);
				}

				// Upload new image
				const imageData = await uploadImage(req.file.path, 'cocktails');
				req.body.image = imageData;
			} catch (uploadError) {
				return res.status(400).json({
					success: false,
					message: 'Error uploading image',
					error: uploadError.message,
				});
			}
		}

		cocktail = await Cocktail.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		}).populate('createdBy', 'name username avatar isVerified');

		res.status(200).json({
			success: true,
			data: cocktail,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Delete cocktail
// @route   DELETE /api/cocktails/:id
// @access  Private
export const deleteCocktail = async (req, res) => {
	try {
		const cocktail = await Cocktail.findById(req.params.id);

		if (!cocktail) {
			return res.status(404).json({
				success: false,
				message: 'Cocktail not found',
			});
		}

		// Make sure user is cocktail owner or admin
		if (
			cocktail.createdBy.toString() !== req.user.id &&
			!req.user.isAdmin
		) {
			return res.status(401).json({
				success: false,
				message: 'Not authorized to delete this cocktail',
			});
		}

		// Delete image from cloudinary
		if (cocktail.image.publicId) {
			await deleteImage(cocktail.image.publicId);
		}

		await cocktail.deleteOne();

		res.status(200).json({
			success: true,
			message: 'Cocktail deleted successfully',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Like/Unlike cocktail
// @route   PUT /api/cocktails/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
	try {
		const cocktail = await Cocktail.findById(req.params.id);

		if (!cocktail) {
			return res.status(404).json({
				success: false,
				message: 'Cocktail not found',
			});
		}

		const likeIndex = cocktail.likes.findIndex(
			(like) => like.user.toString() === req.user.id,
		);

		if (likeIndex > -1) {
			// Unlike
			cocktail.likes.splice(likeIndex, 1);
		} else {
			// Like
			cocktail.likes.push({ user: req.user.id });
		}

		await cocktail.save();

		res.status(200).json({
			success: true,
			data: {
				isLiked: likeIndex === -1,
				likesCount: cocktail.likes.length,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Add comment to cocktail
// @route   POST /api/cocktails/:id/comments
// @access  Private
export const addComment = async (req, res) => {
	try {
		const cocktail = await Cocktail.findById(req.params.id);

		if (!cocktail) {
			return res.status(404).json({
				success: false,
				message: 'Cocktail not found',
			});
		}

		const comment = {
			user: req.user.id,
			text: req.body.text,
		};

		cocktail.comments.push(comment);
		await cocktail.save();

		// Populate the new comment
		await cocktail.populate(
			'comments.user',
			'name username avatar isVerified',
		);

		res.status(201).json({
			success: true,
			data: cocktail.comments[cocktail.comments.length - 1],
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Rate cocktail
// @route   POST /api/cocktails/:id/rating
// @access  Private
export const rateCocktail = async (req, res) => {
	try {
		const cocktail = await Cocktail.findById(req.params.id);

		if (!cocktail) {
			return res.status(404).json({
				success: false,
				message: 'Cocktail not found',
			});
		}

		const existingRatingIndex = cocktail.ratings.findIndex(
			(rating) => rating.user.toString() === req.user.id,
		);

		if (existingRatingIndex > -1) {
			// Update existing rating
			cocktail.ratings[existingRatingIndex].rating = req.body.rating;
		} else {
			// Add new rating
			cocktail.ratings.push({
				user: req.user.id,
				rating: req.body.rating,
			});
		}

		await cocktail.save();

		res.status(200).json({
			success: true,
			data: {
				averageRating: cocktail.averageRating,
				ratingsCount: cocktail.ratings.length,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};
