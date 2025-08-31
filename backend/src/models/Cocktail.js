import mongoose from 'mongoose';
import process from 'process';

const cocktailSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Cocktail name is required'],
			trim: true,
			maxlength: [100, 'Cocktail name cannot exceed 100 characters'],
		},
		description: {
			type: String,
			required: [true, 'Description is required'],
			maxlength: [500, 'Description cannot exceed 500 characters'],
		},
		ingredients: [
			{
				name: {
					type: String,
					required: true,
					trim: true,
				},
				amount: {
					type: String,
					required: true,
					trim: true,
				},
				unit: {
					type: String,
					required: true,
					trim: true,
				},
				optional: {
					type: Boolean,
					default: false,
				},
			},
		],
		instructions: [
			{
				step: {
					type: Number,
					required: true,
				},
				description: {
					type: String,
					required: true,
					trim: true,
				},
			},
		],
		prepTime: {
			type: Number,
			required: [true, 'Preparation time is required'],
			min: [1, 'Preparation time must be at least 1 minute'],
		},
		servings: {
			type: Number,
			required: [true, 'Number of servings is required'],
			min: [1, 'Servings must be at least 1'],
			default: 1,
		},
		glassType: {
			type: String,
			required: [true, 'Glass type is required'],
			trim: true,
		},
		garnish: {
			type: String,
			trim: true,
		},
		image: {
			url: {
				type: String,
				required:
					process.env.NODE_ENV === 'test'
						? false
						: [true, 'Image URL is required'],
			},
			publicId: {
				type: String,
				required:
					process.env.NODE_ENV === 'test'
						? false
						: [true, 'Image public ID is required'],
			},
		},
		category: {
			type: String,
			enum: [
				'signature',
				'classics',
				'seasonal',
				'tropical',
				'winter',
				'summer',
			],
			default: 'signature',
		},
		tags: [
			{
				type: String,
				trim: true,
				maxlength: [30, 'Tag cannot exceed 30 characters'],
			},
		],
		alcoholContent: {
			type: String,
			enum: ['low', 'medium', 'high', 'non-alcoholic'],
			default: 'medium',
		},
		flavor: {
			type: String,
			enum: [
				'sweet',
				'sour',
				'bitter',
				'savory',
				'spicy',
				'fruity',
				'herbal',
			],
			default: 'sweet',
		},
		// Optional provenance & metadata (mainly for classics)
		origin: {
			type: String,
			trim: true,
			maxlength: [150, 'Origin cannot exceed 150 characters'],
		},
		originYear: {
			type: Number,
			min: [1700, 'Origin year seems too early'],
			max: [
				new Date().getFullYear() + 1,
				'Origin year cannot be in the far future',
			],
		},
		iba: {
			type: Boolean,
			default: false,
		},
		aliases: [
			{
				type: String,
				trim: true,
				maxlength: [80, 'Alias cannot exceed 80 characters'],
			},
		],
		defaultTechnique: {
			type: String,
			trim: true,
			maxlength: [60, 'Technique cannot exceed 60 characters'],
		},
		isSystem: {
			type: Boolean,
			default: false, // true for seeded immutable classics
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		isApproved: {
			type: Boolean,
			default: false,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		views: {
			type: Number,
			default: 0,
		},
		likes: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		comments: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				text: {
					type: String,
					required: true,
					maxlength: [500, 'Comment cannot exceed 500 characters'],
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		ratings: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				rating: {
					type: Number,
					required: true,
					min: 1,
					max: 5,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		// Denormalized performance fields
		averageRating: { type: Number, default: 0, min: 0, max: 5 },
		likesCount: { type: Number, default: 0, min: 0 },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Virtual for average rating
// Backward compatibility virtuals (fallback to denormalized fields if present)
cocktailSchema.virtual('computedAverageRating').get(function () {
	if (typeof this.averageRating === 'number' && this.averageRating >= 0) {
		return this.averageRating;
	}
	if (!this.ratings || this.ratings.length === 0) return 0;
	const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
	return Math.round((sum / this.ratings.length) * 10) / 10;
});
cocktailSchema.virtual('computedLikesCount').get(function () {
	if (typeof this.likesCount === 'number') return this.likesCount;
	return this.likes.length;
});

// Helper to compute denormalized fields
function computeDenormalized(doc) {
	if (!doc) return;
	if (Array.isArray(doc.likes)) {
		doc.likesCount = doc.likes.length;
	} else if (typeof doc.likesCount !== 'number') {
		doc.likesCount = 0;
	}
	if (Array.isArray(doc.ratings) && doc.ratings.length) {
		const sum = doc.ratings.reduce((acc, r) => acc + (r.rating || 0), 0);
		doc.averageRating = Math.round((sum / doc.ratings.length) * 10) / 10;
	} else if (typeof doc.averageRating !== 'number') {
		doc.averageRating = 0;
	}
}

cocktailSchema.pre('save', function (next) {
	computeDenormalized(this);
	next();
});

cocktailSchema.pre('insertMany', function (next, docs) {
	if (Array.isArray(docs)) {
		docs.forEach((d) => computeDenormalized(d));
	}
	next();
});

// Virtual for comments count
cocktailSchema.virtual('commentsCount').get(function () {
	return this.comments.length;
});

// Indexes for better search performance
cocktailSchema.index({ name: 'text', description: 'text' });
cocktailSchema.index({ category: 1 });
cocktailSchema.index({ createdBy: 1 });
cocktailSchema.index({ createdAt: -1 });
cocktailSchema.index({ isApproved: 1 });
cocktailSchema.index({ isFeatured: 1 });

// Additional performance indexes
cocktailSchema.index({ 'ingredients.name': 1 });
cocktailSchema.index({ tags: 1 });
cocktailSchema.index({ 'ratings.rating': -1 });
cocktailSchema.index({ averageRating: -1 });
cocktailSchema.index({ likesCount: -1 });
cocktailSchema.index({ createdAt: -1, _id: -1 }); // keyset pagination

// Compound indexes for common queries
cocktailSchema.index({ createdBy: 1, createdAt: -1 });
cocktailSchema.index({ category: 1, isApproved: 1 });
// New performance indexes for high-traffic sorts/filters
cocktailSchema.index({ views: -1, isApproved: 1, createdAt: -1 });

export default mongoose.model('Cocktail', cocktailSchema);

// Additional unique-ish index for classic system cocktails to prevent duplicates by name (case-insensitive)
try {
	cocktailSchema.index({ name: 1 }, { collation: { locale: 'en', strength: 2 } });
} catch {/* index may already exist during hot reload */}
