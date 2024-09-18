import path from 'path';
import multer from 'multer';

import config from '../config.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const subFolder = path.basename(req.path);

        cb(null, `${config.UPLOAD_DIR}/${subFolder}/`);
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const uploader = multer({ storage: storage });