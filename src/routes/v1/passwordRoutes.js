import express from 'express';
import controller from '../../controllers/passwordController.js';
import passwordValidator from '../../validators/passwordValidator.js';

const router = express.Router({ mergeParams: true });

router.post('/request', passwordValidator.passwordRequest, controller.passwordRequest);
router.post('/validate-token', passwordValidator.passwordValidate, controller.passwordValidate);
router.post('/reset', passwordValidator.passwordReset, controller.passwordReset);

export default router;
