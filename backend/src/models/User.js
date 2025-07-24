import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			maxlength: [50, 'Name cannot exceed 50 characters'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			match: [
				/^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
				'Please provide a valid email',
			],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [8, 'Password must be at least 8 characters'],
			validate: {
				validator: function (password) {
					// Strong password: at least one uppercase, one lowercase, one number, one special char
					return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
						password,
					);
				},
				message:
					'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
			},
			select: false,
		},
		username: {
			type: String,
			required: [true, 'Username is required'],
			unique: true,
			trim: true,
			minlength: [3, 'Username must be at least 3 characters'],
			maxlength: [20, 'Username cannot exceed 20 characters'],
		},
		avatar: {
			type: String,
			default:
				'https://res.cloudinary.com/bartendershub/image/upload/v1/default-avatar.jpg',
		},
		bio: {
			type: String,
			maxlength: [500, 'Bio cannot exceed 500 characters'],
		},
		speciality: {
			type: String,
			maxlength: [100, 'Speciality cannot exceed 100 characters'],
		},
		location: {
			type: String,
			maxlength: [100, 'Location cannot exceed 100 characters'],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		badges: [
			{
				type: String,
				maxlength: [30, 'Badge name cannot exceed 30 characters'],
			},
		],
		socialLinks: {
			instagram: String,
			twitter: String,
			linkedin: String,
			website: String,
		},
		preferences: {
			emailNotifications: {
				type: Boolean,
				default: true,
			},
			profileVisibility: {
				type: String,
				enum: ['public', 'private'],
				default: 'public',
			},
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
		joinDate: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Virtual for cocktails count
userSchema.virtual('cocktailsCount', {
	ref: 'Cocktail',
	localField: '_id',
	foreignField: 'createdBy',
	count: true,
});

// Virtual for followers count
userSchema.virtual('followersCount', {
	ref: 'Follow',
	localField: '_id',
	foreignField: 'following',
	count: true,
});

// Virtual for following count
userSchema.virtual('followingCount', {
	ref: 'Follow',
	localField: '_id',
	foreignField: 'follower',
	count: true,
});

// Indexes for better search performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

export default mongoose.model('User', userSchema);
