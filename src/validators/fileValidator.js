import { body } from 'express-validator';
import fileHelpers from '../utils/fileHelpers.js';

const userValidator = {
	upload: [
		body('file')
			.custom((value, { req }) => {
				if (!req.file || req.file == '' || req.file == null || typeof req.file == 'undefined') {
					return false;
				}
				let fileExtension = fileHelpers.getExtension(req.file.originalname);
				let allowedFileExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
				if (!allowedFileExtensions.includes(fileExtension)) {
					return false;
				}
				return true;
			})
			.withMessage('Provided file is invalid'),
	],
};
export default userValidator;
