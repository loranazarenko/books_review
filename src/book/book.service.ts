
import axios from 'axios';
import {HttpError} from "../errors/HttpError";

class BookService {
    private readonly bookServiceUrl: string;

    constructor() {
        this.bookServiceUrl = process.env.BOOK_SERVICE_URL || 'http://localhost:8081';
    }

    async verifyBookExists(bookId: string): Promise<void> {
        if (process.env.NO_BOOK_VERIFICATION && process.env.NODE_ENV === 'test') {
            console.log(`[BookService] Verification disabled - skipping check for book ${bookId}`);
            return;
        }

        try {
            await axios.get(
                `${this.bookServiceUrl}/api/book/${bookId}`,
                {timeout: 5000}
            );
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new HttpError(`Book with id ${bookId} not found`, 400);
            }
            if (error.code === 'ECONNREFUSED') {
                throw new HttpError(`Book service is unavailable`, 502);
            }
            throw new Error(`Failed to verify book: ${error.message}`);
        }
    }
}

export default new BookService();
