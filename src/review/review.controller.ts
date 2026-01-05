import {Request, Response, NextFunction} from 'express';
import {reviewService} from './review.service';
import {validateCreateReviewDto} from './dto/create-review.dto';
import {validateQueryReviewDto} from './dto/query-review.dto';
import bookService from '../book/book.service';
import {HttpError} from "../errors/HttpError";

export class ReviewController {
    /**
     * POST /api/review - Create a new review
     */
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const createDto = validateCreateReviewDto(req.body);
            try {
                await bookService.verifyBookExists(createDto.bookId);
            } catch (bookError: any) {
                res.status(404).json({
                    success: false,
                    message: bookError.message,
                });
                return;
            }

            const review = await reviewService.create(createDto);
            res.status(201).json({
                success: true,
                data: review,
                message: 'Review created successfully',
            });
        } catch (error: any) {
            next(error);
        }
    }

    /**
     * GET /api/review - Get reviews for a paginated book
     */
    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const queryDto = validateQueryReviewDto(req.query);
            const {reviews, total} = await reviewService.findByBookId(
                queryDto.bookId,
                queryDto.from || 0,
                queryDto.size || 10,
            );
            res.status(200).json({
                success: true,
                data: reviews,
                total,
                message: `Retrieved ${reviews.length} reviews out of ${total} total`,
            });
        } catch (error: any) {
            next(error);
        }
    }

    /**
     * POST /api/review/_counts - Get the number of reviews for multiple books
     */
    getCounts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const {bookIds} = req.body;

            if (!bookIds) {
                throw new HttpError('bookIds is required', 400);
            }

            if (!Array.isArray(bookIds)) {
                throw new HttpError('bookIds must be an array', 400);
            }

            if (bookIds.length === 0) {
                throw new HttpError('bookIds array must not be empty', 400);
            }

            const counts = await reviewService.getCountsByBookIds(bookIds);

            res.status(200).json({
                success: true,
                data: counts,
                message: 'Review counts retrieved successfully',
            });
        } catch (error: any) {
            next(error);
        }
    };
}

export const reviewController = new ReviewController();
