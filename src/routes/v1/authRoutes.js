import express from 'express';
import controller from '../../controllers/authController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import authValidator from '../../validators/authValidator.js';

const router = express.Router({ mergeParams: true });

router.post('/login', authValidator.login, controller.login);
router.post('/logout', [authValidator.logout, authMiddleware], controller.logout);
router.post('/token/refresh', authValidator.tokenRefresh, controller.refreshToken);
router.post('/token/validate', authValidator.tokenValidate, controller.validateToken);

export default router;
