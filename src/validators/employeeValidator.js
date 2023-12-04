import { body } from 'express-validator';
const resumeValidator = {
	create: [
		body('type').not().isEmpty().withMessage(`Field is required`).isIn(['educated', 'illiterate']).withMessage(`type should be a value between 'educated', 'illiterate'`),
		body('userId').if(body('type').equals('educated')).not().isEmpty().withMessage('userId is required'),
		body('illiterateEmployeeId').if(body('type').equals('illiterate')).not().isEmpty().withMessage('illiterateEmployeeId is required'),
	],
	update: [body('body', 'Field is required').not().isEmpty()],
};
export default resumeValidator;
