import { Router } from 'express';
import { Upload } from '../configs/multer';
import {
    getPsychotest,
    getPsychotestCreate,
    postPsychotestCreate,
    getPsychotestDetail,
} from '../controllers/psychotest';

const router = new Router();

router.get('/', getPsychotest);

router.get('/create', getPsychotestCreate);
router.post('/create', Upload.single('thumbnail'), postPsychotestCreate);

router.get('/:psyId', getPsychotestDetail);
router.put('/:psyId', getPsychotestDetail);

export default router;
