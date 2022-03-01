import multer from 'multer';

export const Upload = multer({
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
