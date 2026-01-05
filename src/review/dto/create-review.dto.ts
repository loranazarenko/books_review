import {HttpError} from "../../errors/HttpError";

/**
 * DTO for creating a review
 */
export interface CreateReviewDto {
    bookId: string;
    rating: number;
    title: string;
    content: string;
    author: string;
    publishedAt?: string;
}

/**
 * DTO validation
 */
export const validateCreateReviewDto = (data: any): CreateReviewDto => {
    if (!data.bookId || typeof data.bookId !== 'string') {
        throw new HttpError('bookId must be a non-empty string');
    }

    if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
        throw new HttpError('rating must be a number between 1 and 5');
    }

    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
        throw new HttpError('title must be a non-empty string');
    }

    if (data.title.length > 200) {
        throw new HttpError('title must not exceed 200 characters');
    }

    if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
        throw new HttpError('content must be a non-empty string');
    }

    if (data.content.length > 5000) {
        throw new HttpError('content must not exceed 5000 characters');
    }

    if (!data.author || typeof data.author !== 'string' || data.author.trim().length === 0) {
        throw new HttpError('author must be a non-empty string');
    }

    if (data.author.length > 200) {
        throw new HttpError('author must not exceed 200 characters');
    }

    if (data.publishedAt !== undefined) {
        const publishedAt = new Date(data.publishedAt);
        if (isNaN(publishedAt.getTime())) {
            throw new HttpError('publishedAt must be a valid ISO 8601 date');
        }
    }

    return {
        bookId: data.bookId.trim(),
        rating: data.rating,
        title: data.title.trim(),
        content: data.content.trim(),
        author: data.author.trim(),
        publishedAt: data.publishedAt,
    };
};