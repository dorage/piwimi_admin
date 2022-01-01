import { Router } from 'express';
import { putPsyInfo, postPsyOG, putPsyOG } from '../controllers/api';
import multer from 'multer';

const router = new Router();
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            const filename =
                file.fieldname +
                '_' +
                new Date().valueOf() +
                '.' +
                file.originalname.split('.').pop();
            cb(null, filename);
        },
    }),
});

router.get('/', (req, res) => res.send('Hello, API!'));
router.put('/psy/:qId/info', upload.single('thumbnail'), putPsyInfo);
router.put(
    '/psy/:qId/opengraph',
    upload.fields([
        { name: 'ogThumbnail', maxCount: 1 },
        { name: 'twtThumbnail', maxCount: 1 },
    ]),
    putPsyOG,
);
router.post('/psy/:qId/question');
router.post('/psy/:qId/answer/:aid');

export default router;
