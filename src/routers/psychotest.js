import { Router } from 'express';
import {
    getPsychotest,
    getPsychotestCreate,
    getPsychotestDetail,
} from '../controllers/psychotest';

const router = new Router();

router.get('/', getPsychotest);

router.get('/create', getPsychotestCreate);
router.post('/create', getPsychotestCreate);

router.get('/:qId', getPsychotestDetail);
router.put('/:qId', getPsychotestDetail);

export default router;
