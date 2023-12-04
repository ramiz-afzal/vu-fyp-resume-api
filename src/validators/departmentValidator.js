import { body } from 'express-validator';
const resumeValidator = {
	create: [body('title', 'Field is required').not().isEmpty(), body('description', 'Field is required').not().isEmpty()],
	update: [body('body', 'Field is required').not().isEmpty()],
};
export default resumeValidator;
