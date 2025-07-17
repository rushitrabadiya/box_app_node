import express from 'express';
import { uploadSingleFile } from '../middleware/multer';
import { fileController } from '../controllers/file.controller';

const router = express.Router();

router.post('/upload', uploadSingleFile, fileController.upload);
router.get('/', fileController.getFile);
router.get('/:id', fileController.getById);

export default router;
