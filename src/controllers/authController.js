import userModel from '../models/userModel.js';
import refreshTokenModal from '../models/refreshTokenModal.js';
import jwtHelpers from '../utils/jwtHelpers.js';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();
const controller = {
	login: async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const email = req.body.email;
			const password = req.body.password;
			if (!email || !password) {
				return res.status(422).json({ message: 'Invalid request' });
			}

			const user = await userModel.getEntryBy(email, 'email');

			if (!user) {
				return res.status(422).json({ message: 'Invalid request' });
			}

			const verified = await bcrypt.compare(password, user.password);

			if (!verified || typeof verified === Error) {
				return res.status(422).json({ message: 'Invalid password' });
			}

			const accessToken = jwtHelpers.generateAccessJWT(user.id);
			const refreshToken = jwtHelpers.generateRefreshJWT(user.id);
			await refreshTokenModal.saveToken(user.id, refreshToken);
			return res.status(200).send({
				accessToken: accessToken,
				refreshToken: refreshToken,
			});
		} catch (error) {
			return res.status(500).send({ message: 'Something went wrong' });
		}
	},
	logout: async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const userId = req.user.id;
			const refreshToken = req.body.refreshToken;
			const status = await refreshTokenModal.deleteToken(userId, refreshToken);

			if (status) {
				return res.status(200).send({ message: 'Logged out' });
			} else {
				return res.status(500).send({ message: 'Something went wrong' });
			}
		} catch (error) {
			return res.status(500).send({ message: 'Something went wrong' });
		}
	},
	refreshToken: async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const rToken = req.body.refreshToken;

			if (!rToken) {
				return res.status(422).json({ message: 'Invalid request' });
			}

			const isValid = await refreshTokenModal.findToken(rToken);
			if (!isValid) {
				return res.status(422).json({ message: 'Invalid request' });
			}

			const decoded = await jwtHelpers.validateRefreshJWT(rToken);
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

			const newAccessToken = jwtHelpers.generateAccessJWT(user.id);
			return res.status(200).send({ accessToken: newAccessToken });
		} catch (error) {
			return res.status(500).send({ message: 'Something went wrong' });
		}
	},
	validateToken: async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const token = req.body.accessToken;
			const decoded = await jwtHelpers.validateAccessJWT(token);

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

			return res.status(200).send({ isValid: true, accessToken: token, ...decoded });
		} catch (error) {
			return res.status(500).send({ message: 'Something went wrong' });
		}
	},
};
export default controller;
