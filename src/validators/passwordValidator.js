import { body } from 'express-validator';
const passwordValidator = {
	passwordRequest: [body('email', 'Field is required').not().isEmpty()],
	passwordValidate: [body('resetToken', 'Field is required').not().isEmpty()],
	passwordReset: [
		body('resetToken', 'Field is required').not().isEmpty(),
		body('password', 'Field is required').not().isEmpty(),
		body('password', 'The minimum password length is 6 characters').isLength({ min: 6 }),
		body('confirmPassword')
			.exists({ checkFalsy: true })
			.withMessage('You must type a confirmation password')
			.custom((value, { req }) => req.body && req.body.password && value === req.body.password)
			.withMessage('The passwords do not match'),
	],
};
export default passwordValidator;
