import { Router } from 'express';
import { putPsyInfo, postPsyOG, putPsyOG } from '../controllers/api';
import { Upload } from '../configs/multer';

const router = new Router();

router.get('/', (req, res) => res.send('Hello, API!'));
router.put('/psy/:psyId/info', Upload.single('thumbnail'), putPsyInfo);
router.put(
    '/psy/:psyId/opengraph',
    Upload.fields([
        { name: 'ogThumbnail', maxCount: 1 },
        { name: 'twtThumbnail', maxCount: 1 },
    ]),
    putPsyOG,
);
router.post('/psy/:psyId/question');
router.post('/psy/:psyId/answer/:aid');

export default router;
