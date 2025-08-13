import mongoose from 'mongoose';

const followSchema = new mongoose.Schema(
	{
		follower: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		following: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// Compound index to prevent duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Individual indexes for optimizing queries
followSchema.index({ follower: 1, createdAt: -1 }); // For getting user's following list
followSchema.index({ following: 1, createdAt: -1 }); // For getting user's followers list

export default mongoose.model('Follow', followSchema);
