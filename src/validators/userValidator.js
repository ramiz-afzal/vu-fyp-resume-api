import { body } from 'express-validator';
const userValidator = {
	create: [
		body('email', 'Field is required').not().isEmpty(),
		body('password', 'Field is required').not().isEmpty(),
		body('firstName', 'Field is required').not().isEmpty(),
		body('lastName', 'Field is required').not().isEmpty(),
		body('gender', 'Field is required').not().isEmpty(),
		body('dob', 'Field is required').not().isEmpty(),
		body('accountType', 'Field is required').not().isEmpty(),
		body('email', 'Invalid email').isEmail(),
		body('password', 'The minimum password length is 6 characters').isLength({ min: 6 }),
		body('confirmPassword')
			.exists({ checkFalsy: true })
			.withMessage('You must type a confirmation password')
			.custom((value, { req }) => req.body && req.body.password && value === req.body.password)
			.withMessage('The passwords do not match'),
	],
	update: [body('body', 'Field is required').not().isEmpty()],
};
export default userValidator;
