import { body } from 'express-validator';
const educationValidator = {
	create: [body('inProcess', 'Field is required').not().isEmpty().withMessage('Field should be a Boolean').isBoolean(), body('institute', 'Field is required').not().isEmpty(), body('degree', 'Field is required').not().isEmpty(), body('startDate', 'Field is required').not().isEmpty()],
	update: [body('body', 'Field is required').not().isEmpty()],
};
export default educationValidator;
