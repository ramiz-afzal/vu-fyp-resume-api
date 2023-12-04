import { body } from 'express-validator';
const experienceValidator = {
	create: [body('stillEmployed', 'Field is required').not().isEmpty().withMessage('Field should be a Boolean').isBoolean(), body('company', 'Field is required').not().isEmpty(), body('designation', 'Field is required').not().isEmpty(), body('startDate', 'Field is required').not().isEmpty()],
	update: [body('body', 'Field is required').not().isEmpty()],
};
export default experienceValidator;
