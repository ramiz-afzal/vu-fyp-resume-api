import express from 'express';
import controller from '../../controllers/userController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import adminRoleMiddleware from '../../middleware/adminRoleMiddleware.js';
import userValidator from '../../validators/userValidator.js';

const router = express.Router({ mergeParams: true });
router.get('/', authMiddleware, controller.getEntries);
router.get('/:id', authMiddleware, controller.getEntry);
router.post('/', userValidator.create, controller.createEntry);
router.patch('/:id', [authMiddleware, userValidator.update], controller.updateEntry);
router.delete('/:id', [authMiddleware, adminRoleMiddleware], controller.deleteEntry);

export default router;
