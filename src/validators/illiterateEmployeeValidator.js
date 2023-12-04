import { body } from 'express-validator';
const resumeValidator = {
	create: [body('firstName', 'Field is required').not().isEmpty(), body('lastName', 'Field is required').not().isEmpty(), body('designation', 'Field is required').not().isEmpty(), body('startDate', 'Field is required').not().isEmpty()],
	update: [body('body', 'Field is required').not().isEmpty()],
};
export default resumeValidator;
