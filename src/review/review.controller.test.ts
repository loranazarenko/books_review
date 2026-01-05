import request from 'supertest';
import app from '../../src/app';
import {Review} from './review.model';
import {clearDatabase, startMongoContainer, stopMongoContainer} from '../config/mongo.setup';

describe('ReviewController Integration Tests', () => {
    beforeAll(async () => {
        await startMongoContainer();
    });

    afterAll(async () => {
        await stopMongoContainer();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

    describe('POST /api/review - Create Review', () => {
        it('should create a review successfully', async () => {
            const response = await request(app)
                .post('/api/review')
                .send({
                    bookId: '1',
                    rating: 5,
                    title: 'Excellent Book',
                    content: 'This is an excellent book that I highly recommend',
                    author: 'Jane Smith',
                })
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('_id');
            expect(response.body.data.bookId).toBe('1');
            expect(response.body.data.rating).toBe(5);
        });

        it('should validate rating (min=1)', async () => {
            const response = await request(app)
                .post('/api/review')
                .send({
                    bookId: '1',
                    rating: 0,
                    title: 'Test',
                    content: 'Content',
                    author: 'Author',
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('should validate rating (max=5)', async () => {
            const response = await request(app)
                .post('/api/review')
                .send({
                    bookId: '1',
                    rating: 10,
                    title: 'Test',
                    content: 'Content',
                    author: 'Author',
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('should set publishedAt to current time if not provided', async () => {
            const response = await request(app)
                .post('/api/review')
                .send({
                    bookId: '1',
                    rating: 5,
                    title: 'Test',
                    content: 'Content',
                    author: 'Author',
                })
                .expect(201);

            expect(response.body.data.publishedAt).toBeDefined();
            const publishedAt = new Date(response.body.data.publishedAt);
            const now = new Date();
            expect(Math.abs(now.getTime() - publishedAt.getTime())).toBeLessThan(5000);
        });

        it('should accept custom publishedAt', async () => {
            const customDate = '2024-12-15T08:30:00Z';
            const response = await request(app)
                .post('/api/review')
                .send({
                    bookId: '1',
                    rating: 5,
                    title: 'Test',
                    content: 'Content',
                    author: 'Author',
                    publishedAt: customDate,
                })
                .expect(201);

            expect(response.body.data.publishedAt).toBe(new Date(customDate).toISOString());
        });

        it('should return 400 for invalid publishedAt format', async () => {
            const response = await request(app)
                .post('/api/review')
                .send({
                    bookId: '1',
                    rating: 5,
                    title: 'Test',
                    content: 'Content',
                    author: 'Author',
                    publishedAt: 'invalid-date',
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/review - Get Reviews', () => {
        beforeEach(async () => {
            const reviews = [
                {
                    bookId: '1',
                    rating: 5,
                    title: 'Great',
                    content: 'Amazing book',
                    author: 'Author 1',
                    publishedAt: new Date('2024-12-31T03:00:00Z'),
                },
                {
                    bookId: '1',
                    rating: 4,
                    title: 'Good',
                    content: 'Nice read',
                    author: 'Author 2',
                    publishedAt: new Date('2024-12-30T12:00:00Z'),
                },
                {
                    bookId: '2',
                    rating: 3,
                    title: 'OK',
                    content: 'Decent',
                    author: 'Author 3',
                    publishedAt: new Date('2024-12-29T08:00:00Z'),
                },
            ];

            await Review.insertMany(reviews);
        });

        it('should return reviews sorted by publishedAt descending (newest first)', async () => {
            const response = await request(app)
                .get('/api/review?bookId=1')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0].title).toBe('Great');
            expect(response.body.data[1].title).toBe('Good');
        });

        it('should apply pagination correctly (from, size)', async () => {
            const response = await request(app)
                .get('/api/review?bookId=1&from=0&size=1')
                .expect(200);

            expect(response.body.data).toHaveLength(1);
            expect(response.body.total).toBe(2);
        });

        it('should return 400 if bookId is missing', async () => {
            const response = await request(app)
                .get('/api/review')
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('should return 400 if size exceeds 100', async () => {
            const response = await request(app)
                .get('/api/review?bookId=1&size=101')
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('should return empty array for non-existent book', async () => {
            const response = await request(app)
                .get('/api/review?bookId=999')
                .expect(200);

            expect(response.body.data).toHaveLength(0);
            expect(response.body.total).toBe(0);
        });
    });

    describe('POST /api/review/_counts - Get Counts', () => {
        beforeEach(async () => {
            const reviews = [
                {bookId: '1', rating: 5, title: 'A', content: 'Content', author: 'Author'},
                {bookId: '1', rating: 4, title: 'B', content: 'Content', author: 'Author'},
                {bookId: '2', rating: 3, title: 'C', content: 'Content', author: 'Author'},
            ];

            await Review.insertMany(reviews);
        });

        it('should return counts for multiple books using aggregation', async () => {
            const response = await request(app)
                .post('/api/review/_counts')
                .send({bookIds: ['1', '2', '3']})
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data['1']).toBe(2);
            expect(response.body.data['2']).toBe(1);
            expect(response.body.data['3']).toBe(0);
        });

        it('should return 400 if bookIds is empty', async () => {
            const response = await request(app)
                .post('/api/review/_counts')
                .send({bookIds: []})
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('should return 400 if bookIds is not provided', async () => {
            const response = await request(app)
                .post('/api/review/_counts')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });
});
