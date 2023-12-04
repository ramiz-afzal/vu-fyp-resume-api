import { body } from 'express-validator';
const certificateValidator = {
	create: [body('institute', 'Field is required').not().isEmpty(), body('title', 'Field is required').not().isEmpty(), body('description', 'Field is required').not().isEmpty()],
	update: [body('body', 'Field is required').not().isEmpty()],
};
export default certificateValidator;
