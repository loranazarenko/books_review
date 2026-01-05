import {Request, Response, NextFunction} from 'express';
import { HttpError } from '../errors/HttpError';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        return res.status(err.status).json({ success: false, message: err.message, details: err.details || null });
    }

    // handle mongoose CastError (invalid ObjectId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyErr = err as any;
    if (anyErr && (anyErr.name === 'CastError' || anyErr.name === 'ValidationError')) {
        return res.status(400).json({ success: false, message: anyErr.message });
    }

    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
}
