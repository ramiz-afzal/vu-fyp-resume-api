import { body } from 'express-validator';
const resumeValidator = {
	create: [
		body('firstName', 'Field is required').not().isEmpty(),
		body('lastName', 'Field is required').not().isEmpty(),
		body('designation', 'Field is required').not().isEmpty(),
		body('phone', 'Field is required').not().isEmpty(),
		body('gender', 'Field is required').not().isEmpty(),
		body('dob', 'Field is required').not().isEmpty(),
		body('religion', 'Field is required').not().isEmpty(),
		body('martialStatus', 'Field is required').not().isEmpty(),
		body('address_1', 'Field is required').not().isEmpty(),
		body('city', 'Field is required').not().isEmpty(),
		body('state', 'Field is required').not().isEmpty(),
		body('country', 'Field is required').not().isEmpty(),
	],
	update: [body('body', 'Field is required').not().isEmpty()],
};
export default resumeValidator;
