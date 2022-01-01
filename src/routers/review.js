import { Router } from 'express';
import { getReviews } from '../controllers/review';

const router = new Router();

router.get('/', getReviews);

export default router;
