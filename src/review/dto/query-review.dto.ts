import {HttpError} from "../../errors/HttpError";

/**
 * DTO for requesting reviews with pagination
 */
export interface QueryReviewDto {
    bookId: string;
    from?: number;
    size?: number;
}

/**
 * Validation of query parameters
 */
export const validateQueryReviewDto = (query: any): QueryReviewDto => {
    if (!query.bookId || typeof query.bookId !== 'string') {
        throw new HttpError('bookId is required and must be a string');
    }

    const from = query.from ? parseInt(query.from as string, 10) : 0;
    if (isNaN(from) || from < 0) {
        throw new HttpError('from must be a non-negative number');
    }

    const size = query.size ? parseInt(query.size as string, 10) : 10;
    if (isNaN(size) || size < 1 || size > 100) {
        throw new HttpError('size must be between 1 and 100');
    }

    return {
        bookId: query.bookId.trim(),
        from,
        size,
    };
};