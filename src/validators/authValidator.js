import { body } from 'express-validator';
const authValidator = {
	login: [body('email', 'Email is required').not().isEmpty(), body('email', 'Invalid email').isEmail(), body('password', 'Password is required').not().isEmpty()],
	logout: [body('refreshToken', 'refreshToken is required').not().isEmpty()],
	tokenRefresh: [body('refreshToken', 'refreshToken is required').not().isEmpty()],
	tokenValidate: [body('accessToken', 'accessToken is required').not().isEmpty()],
};
export default authValidator;
