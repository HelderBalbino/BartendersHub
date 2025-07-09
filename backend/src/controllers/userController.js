import User from '../models/User.js';
import Cocktail from '../models/Cocktail.js';
import Follow from '../models/Follow.js';
import { uploadAvatar, deleteImage } from '../utils/cloudinary.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		// Build query
		let query = {};

		// Filter by verified status
		if (req.query.verified) {
			query.isVerified = req.query.verified === 'true';
		}

		// Search by name or username
		if (req.query.search) {
			query.$or = [
				{ name: { $regex: req.query.search, $options: 'i' } },
				{ username: { $regex: req.query.search, $options: 'i' } },
			];
		}

		// Sort options
		let sortBy = { createdAt: -1 };
		if (req.query.sortBy === 'cocktails') {
			// We'll need to use aggregation for this
			sortBy = { cocktailsCount: -1 };
		} else if (req.query.sortBy === 'followers') {
			sortBy = { followersCount: -1 };
		}

		const users = await User.find(query)
			.populate('cocktailsCount')
			.populate('followersCount')
			.populate('followingCount')
			.sort(sortBy)
			.skip(skip)
			.limit(limit)
			.select('-password');

		const total = await User.countDocuments(query);

		res.status(200).json({
			success: true,
			count: users.length,
			total,
			page,
			pages: Math.ceil(total / limit),
			data: users,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
export const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id)
			.populate('cocktailsCount')
			.populate('followersCount')
			.populate('followingCount')
			.select('-password');

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}

		// Get user's cocktails
		const cocktails = await Cocktail.find({
			createdBy: req.params.id,
			isApproved: true,
		})
			.sort({ createdAt: -1 })
			.limit(6);

		res.status(200).json({
			success: true,
			data: {
				user,
				cocktails,
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
	try {
		const fieldsToUpdate = {
			name: req.body.name,
			bio: req.body.bio,
			speciality: req.body.speciality,
			location: req.body.location,
			socialLinks: req.body.socialLinks,
			preferences: req.body.preferences,
		};

		// Handle avatar upload
		if (req.file) {
			try {
				const user = await User.findById(req.user.id);

				// Delete old avatar if it's not the default
				if (user.avatar && !user.avatar.includes('default-avatar')) {
					const publicId = user.avatar.split('/').pop().split('.')[0];
					await deleteImage(`bartendershub/avatars/${publicId}`);
				}

				// Upload new avatar
				const avatarData = await uploadAvatar(req.file.path);
				fieldsToUpdate.avatar = avatarData.url;
			} catch (uploadError) {
				return res.status(400).json({
					success: false,
					message: 'Error uploading avatar',
					error: uploadError.message,
				});
			}
		}

		const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
			new: true,
			runValidators: true,
		}).select('-password');

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Follow/Unfollow user
// @route   PUT /api/users/:id/follow
// @access  Private
export const toggleFollow = async (req, res) => {
	try {
		const userToFollow = await User.findById(req.params.id);

		if (!userToFollow) {
			return res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}

		if (req.params.id === req.user.id) {
			return res.status(400).json({
				success: false,
				message: 'You cannot follow yourself',
			});
		}

		const existingFollow = await Follow.findOne({
			follower: req.user.id,
			following: req.params.id,
		});

		if (existingFollow) {
			// Unfollow
			await Follow.findByIdAndDelete(existingFollow._id);

			res.status(200).json({
				success: true,
				message: 'User unfollowed successfully',
				isFollowing: false,
			});
		} else {
			// Follow
			await Follow.create({
				follower: req.user.id,
				following: req.params.id,
			});

			res.status(200).json({
				success: true,
				message: 'User followed successfully',
				isFollowing: true,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Get user's followers
// @route   GET /api/users/:id/followers
// @access  Public
export const getFollowers = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const followers = await Follow.find({ following: req.params.id })
			.populate('follower', 'name username avatar isVerified')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const total = await Follow.countDocuments({ following: req.params.id });

		res.status(200).json({
			success: true,
			count: followers.length,
			total,
			page,
			pages: Math.ceil(total / limit),
			data: followers.map((follow) => follow.follower),
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Get user's following
// @route   GET /api/users/:id/following
// @access  Public
export const getFollowing = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const following = await Follow.find({ follower: req.params.id })
			.populate('following', 'name username avatar isVerified')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const total = await Follow.countDocuments({ follower: req.params.id });

		res.status(200).json({
			success: true,
			count: following.length,
			total,
			page,
			pages: Math.ceil(total / limit),
			data: following.map((follow) => follow.following),
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Get user's cocktails
// @route   GET /api/users/:id/cocktails
// @access  Public
export const getUserCocktails = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const cocktails = await Cocktail.find({
			createdBy: req.params.id,
			isApproved: true,
		})
			.populate('createdBy', 'name username avatar isVerified')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const total = await Cocktail.countDocuments({
			createdBy: req.params.id,
			isApproved: true,
		});

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
