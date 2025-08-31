import Cocktail from '../models/Cocktail.js';
// Buffer is a global in Node; ensure linter knows usage
/* eslint no-undef: 0 */
import { uploadImage, deleteImage } from '../utils/cloudinary.js';
import { invalidateCocktailCache } from '../middleware/cache.js';

// @desc    Get all cocktails
// @route   GET /api/cocktails
// @access  Public
export const getCocktails = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1; // legacy pagination support
		const limit = Math.min(parseInt(req.query.limit) || 10, 100);
		const cursor = req.query.cursor; // base64 encoded createdAt|_id
		let cursorQuery = {};
		if (cursor) {
			try {
				const raw = Buffer.from(cursor, 'base64').toString('utf8');
				const [createdAtStr, id] = raw.split('|');
				const createdAt = new Date(createdAtStr);
				if (!isNaN(createdAt)) {
					cursorQuery = {
						$or: [
							{ createdAt: { $lt: createdAt } },
							{ createdAt, _id: { $lt: id } },
						],
					};
				}
			} catch {
				// ignore bad cursor
			}
		}

		// Build query
		let query = { isApproved: true };

		// Filter by category
		if (req.query.category) {
			query.category = req.query.category;
		}

		// Filter by alcohol content
		if (req.query.alcoholContent) {
			query.alcoholContent = req.query.alcoholContent;
		}

		// Filter by creator (for "My Cocktails" view)
		if (req.query.createdBy) {
			query.createdBy = req.query.createdBy;
		}

		// Search by name or description
		if (req.query.search) {
			query.$text = { $search: req.query.search };
		}

		// Determine sort option (now uses denormalized fields)
		const sortOption = req.query.sortBy;

		// Field selection for optimized responses (convert to projection if aggregation)
		const rawFields = req.query.fields
			? req.query.fields
					.split(',')
					.map((f) => f.trim())
					.filter(Boolean)
			: [];
		const projection = {};
		if (rawFields.length) {
			rawFields.forEach((f) => (projection[f] = 1));
		}

		let cocktails;
		const total = await Cocktail.countDocuments(query); // total for legacy pagination

		// Build sort
		let sortBy = { createdAt: -1, _id: -1 };
		if (sortOption === 'views') sortBy = { views: -1, createdAt: -1 };
		if (sortOption === 'rating')
			sortBy = { averageRating: -1, createdAt: -1 };
		if (sortOption === 'likes') sortBy = { likesCount: -1, createdAt: -1 };

		const findQuery = { ...query, ...cursorQuery };
		cocktails = await Cocktail.find(findQuery)
			.select(rawFields.length ? rawFields.join(' ') : '')
			.populate('createdBy', 'name username avatar isVerified')
			.sort(sortBy)
			.limit(limit + 1) // fetch one extra to determine next cursor
			.lean();

		let nextCursor = null;
		if (cocktails.length > limit) {
			const last = cocktails[limit - 1];
			nextCursor = Buffer.from(
				`${last.createdAt.toISOString()}|${last._id}`,
			).toString('base64');
			cocktails = cocktails.slice(0, limit);
		}

		res.success(cocktails, {
			count: cocktails.length,
			cursor: nextCursor,
			page: cursor ? undefined : page,
			pages: cursor ? undefined : Math.ceil(total / limit),
			total: cursor ? undefined : total,
		});
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
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

		if (!cocktail) return res.fail(404, 'Cocktail not found', 'NOT_FOUND');

		// Increment view count
		await Cocktail.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

		res.success(cocktail);

		// Invalidate cache after update
		invalidateCocktailCache();
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
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
				return res.fail(400, 'Error uploading image', 'UPLOAD_FAILED', {
					detail: uploadError.message,
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

		// Invalidate cocktail cache
		invalidateCocktailCache();

		res.success(
			cocktail,
			{ message: 'Cocktail created successfully' },
			201,
		);
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Update cocktail
// @route   PUT /api/cocktails/:id
// @access  Private
export const updateCocktail = async (req, res) => {
	try {
		let cocktail = await Cocktail.findById(req.params.id);

		if (!cocktail) return res.fail(404, 'Cocktail not found', 'NOT_FOUND');

		// Make sure user is cocktail owner or admin
		if (
			cocktail.createdBy.toString() !== req.user.id &&
			!req.user.isAdmin
		) {
			return res.fail(
				401,
				'Not authorized to update this cocktail',
				'NOT_OWNER',
			);
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
				return res.fail(400, 'Error uploading image', 'UPLOAD_FAILED', {
					detail: uploadError.message,
				});
			}
		}

		cocktail = await Cocktail.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		}).populate('createdBy', 'name username avatar isVerified');

		res.success(cocktail);
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Delete cocktail
// @route   DELETE /api/cocktails/:id
// @access  Private
export const deleteCocktail = async (req, res) => {
	try {
		const cocktail = await Cocktail.findById(req.params.id);

		if (!cocktail) return res.fail(404, 'Cocktail not found', 'NOT_FOUND');

		// Make sure user is cocktail owner or admin
		if (
			cocktail.createdBy.toString() !== req.user.id &&
			!req.user.isAdmin
		) {
			return res.fail(
				401,
				'Not authorized to delete this cocktail',
				'NOT_OWNER',
			);
		}

		// Delete image from cloudinary
		if (cocktail.image.publicId) {
			await deleteImage(cocktail.image.publicId);
		}

		await cocktail.deleteOne();

		res.success(null, { message: 'Cocktail deleted successfully' });

		// Invalidate cache after deletion
		invalidateCocktailCache();
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Like/Unlike cocktail
// @route   PUT /api/cocktails/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
	try {
		const cocktail = await Cocktail.findById(req.params.id);

		if (!cocktail) return res.fail(404, 'Cocktail not found', 'NOT_FOUND');

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

		// Update denormalized like count (pre-save hook recomputes but set explicitly for clarity)
		cocktail.likesCount = cocktail.likes.length;
		await cocktail.save();

		res.success({
			isLiked: likeIndex === -1,
			likesCount: cocktail.likes.length,
		});

		invalidateCocktailCache();
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Add comment to cocktail
// @route   POST /api/cocktails/:id/comments
// @access  Private
export const addComment = async (req, res) => {
	try {
		const cocktail = await Cocktail.findById(req.params.id);

		if (!cocktail) return res.fail(404, 'Cocktail not found', 'NOT_FOUND');

		const comment = {
			user: req.user.id,
			text: req.body.text,
		};

		cocktail.comments.push(comment);
		// Recompute denormalized rating
		if (cocktail.ratings.length) {
			const sum = cocktail.ratings.reduce((acc, r) => acc + r.rating, 0);
			cocktail.averageRating =
				Math.round((sum / cocktail.ratings.length) * 10) / 10;
		} else {
			cocktail.averageRating = 0;
		}
		await cocktail.save();

		// Populate the new comment
		await cocktail.populate(
			'comments.user',
			'name username avatar isVerified',
		);

		res.success(
			cocktail.comments[cocktail.comments.length - 1],
			{ message: 'Comment added' },
			201,
		);

		invalidateCocktailCache();
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Rate cocktail
// @route   POST /api/cocktails/:id/rating
// @access  Private
export const rateCocktail = async (req, res) => {
	try {
		const cocktail = await Cocktail.findById(req.params.id);

		if (!cocktail) return res.fail(404, 'Cocktail not found', 'NOT_FOUND');

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

		res.success({
			averageRating: cocktail.averageRating,
			ratingsCount: cocktail.ratings.length,
		});

		invalidateCocktailCache();
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};
