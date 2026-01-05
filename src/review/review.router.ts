import {Router} from 'express';
import {reviewController} from './review.controller';

const router = Router();

router.post('/api/review', (req,
                             res,
                             next) => {
    reviewController.create(req, res, next).catch(next);
});

router.get('/api/review', (req,
                            res,
                            next) => {
    reviewController.findAll(req, res, next).catch(next);
});

router.post('/api/review/_counts', (req,
                                     res,
                                     next) => {
    reviewController.getCounts(req, res, next).catch(next);
});

export default router;
