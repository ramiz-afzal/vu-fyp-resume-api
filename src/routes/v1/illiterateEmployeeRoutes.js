import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import illiterateEmployeeController from '../../controllers/illiterateEmployeeController.js';
import illiterateEmployeeValidator from '../../validators/illiterateEmployeeValidator.js';

const router = express.Router({ mergeParams: true });
router.get('/', authMiddleware, illiterateEmployeeController.getEntries);
router.get('/:illiterateEmployeeId', authMiddleware, illiterateEmployeeController.getEntry);
router.post('/', [authMiddleware, illiterateEmployeeValidator.create], illiterateEmployeeController.createEntry);
router.patch('/:illiterateEmployeeId', [authMiddleware, illiterateEmployeeValidator.update], illiterateEmployeeController.updateEntry);
router.delete('/:illiterateEmployeeId', [authMiddleware], illiterateEmployeeController.deleteEntry);

export default router;
