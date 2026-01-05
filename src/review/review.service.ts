import {ReviewRepository} from './review.repository';
import {CreateReviewDto} from './dto/create-review.dto';
import {IReview} from './review.model';

export class ReviewService {
    constructor(private repository: ReviewRepository) {
    }

    /**
     * Create a new review
     */
    async create(createReviewDto: CreateReviewDto): Promise<IReview> {
        return this.repository.create(createReviewDto);
    }

    /**
     * Get reviews for a paginated book
     */
    async findByBookId(
        bookId: string,
        from: number = 0,
        size: number = 10,
    ): Promise<{ reviews: IReview[]; total: number }> {
        const [reviews, total] = await Promise.all([
            this.repository.findByBookId(bookId, from, size),
            this.repository.countByBookId(bookId),
        ]);
        return {reviews, total};
    }

    /**
     * Get the number of reviews for multiple books
     */
    async getCountsByBookIds(bookIds: string[]): Promise<Record<string, number>> {
        if (!Array.isArray(bookIds) || bookIds.length === 0) {
            throw new Error('bookIds array must not be empty');
        }

        return this.repository.countsByBookIds(bookIds);
    }
}

export const reviewService = new ReviewService(new ReviewRepository());
