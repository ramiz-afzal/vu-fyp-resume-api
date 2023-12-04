import userModel from '../models/userModel.js';
import resetTokenModal from '../models/resetTokenModal.js';
import jwtHelpers from '../utils/jwtHelpers.js';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();
const controller = {
	passwordRequest: async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const email = req.body.email;
			if (!email) {
				return res.status(422).json({ message: 'Invalid request' });
			}

			const user = await userModel.getEntryBy(email, 'email');
			if (!user) {
				return res.status(422).json({ message: 'Invalid request' });
			}

			const refreshToken = jwtHelpers.generateResetJWT(user.id);
			await resetTokenModal.saveToken(user.id, refreshToken);

			// TODO send reset token via email to user

			return res.status(200).send({ message: 'Reset token sent over email' });
		} catch (error) {
			return res.status(500).send({ message: 'Something went wrong' });
		}
	},
	passwordValidate: async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const resetToken = req.body.resetToken;
			if (!resetToken) {
				return res.status(422).json({ message: 'Invalid request' });
			}

			const decoded = await jwtHelpers.validateResetJWT(resetToken);
			const userId = decoded?.user?.id;
			if (!userId) {
				res.status(403).send({ message: 'Unauthorized' });
				return;
			}

			const user = await userModel.getEntryBy(userId);
			if (!user) {
				res.status(403).send({ message: 'Unauthorized' });
				return;
			}

			return res.status(200).send({ isValid: true, resetToken: decoded });
		} catch (error) {
			return res.status(500).send({ message: 'Something went wrong' });
		}
	},
	passwordReset: async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const resetToken = req.body.resetToken;
			const password = req.body.password;
			if (!resetToken || !password) {
				return res.status(422).json({ message: 'Invalid request' });
			}

			const decoded = await jwtHelpers.validateResetJWT(resetToken);
			const userId = decoded?.user?.id;
			if (!userId) {
				res.status(403).send({ message: 'Unauthorized' });
				return;
			}

			const user = await userModel.getEntryBy(userId);
			if (!user) {
				res.status(403).send({ message: 'Unauthorized' });
				return;
			}

			let result = await userModel.updatePassword(userId, password);
			if (!result) {
				return res.status(500).send({ message: 'Something went wrong' });
			}
			return res.status(204).send({ user: result, message: 'user updated' });
		} catch (error) {
			return res.status(500).send({ message: 'Something went wrong' });
		}
	},
};
export default controller;
