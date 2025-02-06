import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = 'uploads/fotos/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadFoto = multer({ storage: storage });
