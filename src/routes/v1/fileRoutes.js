import express from 'express';
import controller from '../../controllers/fileController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import uploadMiddleware from '../../middleware/uploadMiddleware.js';
import fileValidator from '../../validators/fileValidator.js';
const router = express.Router({ mergeParams: true });
router.get('/:id', [authMiddleware], controller.getEntry);
router.post('/', [authMiddleware, uploadMiddleware, fileValidator.upload], controller.createEntry);
router.delete('/:id', [authMiddleware], controller.deleteEntry);

export default router;
