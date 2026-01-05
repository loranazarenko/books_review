import express, {Application} from 'express';
import reviewRouter from './review/review.router';
import {errorHandler} from './middleware/errorHandler';

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use(reviewRouter);

// Error handler
app.use(errorHandler);

export default app;