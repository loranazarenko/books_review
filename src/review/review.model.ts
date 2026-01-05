import mongoose, {Document, Schema} from 'mongoose';

/**
 * Review interface extending Mongoose Document
 */
export interface IReview {
    _id?: string | mongoose.Types.ObjectId;
    bookId: string;
    rating: number;
    title: string;
    content: string;
    author: string;
    publishedAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Review schema
 */
const reviewSchema = new Schema<IReview>(
    {
        bookId: {
            type: String,
            required: [true, 'bookId is required'],
            trim: true,
        },
        rating: {
            type: Number,
            required: [true, 'rating is required'],
            min: [1, 'rating must be at least 1'],
            max: [5, 'rating must not exceed 5'],
        },
        title: {
            type: String,
            required: [true, 'title is required'],
            minlength: [1, 'title cannot be empty'],
            maxlength: [200, 'title must not exceed 200 characters'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'content is required'],
            minlength: [1, 'content cannot be empty'],
            maxlength: [5000, 'content must not exceed 5000 characters'],
            trim: true,
        },
        author: {
            type: String,
            required: [true, 'author is required'],
            minlength: [1, 'author cannot be empty'],
            maxlength: [200, 'author must not exceed 200 characters'],
            trim: true,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
        collection: 'reviews',
    }
);

// Index for query optimization
reviewSchema.index({bookId: 1, publishedAt: -1});

export const Review = mongoose.model<IReview>('Review', reviewSchema);