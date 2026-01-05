import {Review, IReview} from './review.model';
import {CreateReviewDto} from './dto/create-review.dto';
import {HttpError} from "../errors/HttpError";

export class ReviewRepository {
    /**
     * Create a new review
     */
    async create(createReviewDto: CreateReviewDto): Promise<IReview> {
        const publishedAt = createReviewDto.publishedAt
            ? new Date(createReviewDto.publishedAt)
            : new Date();

        const review = new Review({
            ...createReviewDto,
            publishedAt,
        });

        return review.save();
    }

    /**
     * Get reviews for a paginated book sorted by descending time
     */
    async findByBookId(bookId: string, from: number, size: number): Promise<IReview[]> {
        return Review.find({bookId})
            .sort({publishedAt: -1})
            .skip(from)
            .limit(size)
            .lean()
            .exec();
    }

    /**
     * Counting reviews for one book
     */
    async countByBookId(bookId: string): Promise<number> {
        return Review.countDocuments({bookId}).exec();
    }

    /**
     * Counting reviews for multiple books with one query (aggregation)
     */
    async countsByBookIds(bookIds: string[]): Promise<Record<string, number>> {
        if (!Array.isArray(bookIds)) {
            throw new HttpError('bookIds must be an array', 400);
        }

        const ids = Array.from(new Set(bookIds.map(id => String(id).trim())));

        const result: Record<string, number> = {};
        ids.forEach(id => {
            result[id] = 0;
        });

        if (ids.length === 0) return result;

        try {
            const counts = await Review.aggregate([
                {$match: {bookId: {$in: ids}}},
                {$group: {_id: '$bookId', count: {$sum: 1}}}
            ]).exec();

            for (const row of counts) {
                const key = String(row._id);
                result[key] = Number(row.count) || 0;
            }

            return result;
        } catch (err) {
            // @ts-ignore
            throw new Error(`Aggregation failed: ${err.message}`);
        }
    }

    /**
     * Delete all reviews (for testing)
     */
    async deleteAll(): Promise<void> {
        await Review.deleteMany({});
    }

    /**
     * Get review by ID
     */
    async findById(id: string): Promise<IReview | null> {
        const doc = await Review.findById(id).lean().exec();
        return doc as IReview | null;
    }
}

export const reviewRepository = new ReviewRepository();