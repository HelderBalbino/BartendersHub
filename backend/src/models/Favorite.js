import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		cocktail: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Cocktail',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// Compound index to prevent duplicate favorites
favoriteSchema.index({ user: 1, cocktail: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
