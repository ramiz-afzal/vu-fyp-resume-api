import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export default {
	generateAccessJWT: (userId) => {
		if (!userId) {
			throw new Error('userId is required');
		}

		const payload = { user: { id: userId } };
		const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 15 });

		if (!token) {
			throw new Error('token could not be created');
		}

		return token;
	},
	generateRefreshJWT: (userId) => {
		if (!userId) {
			throw new Error('userId is required');
		}

		const payload = { user: { id: userId } };
		const token = jwt.sign(payload, process.env.JWT_REFRESH_KEY);

		if (!token) {
			throw new Error('token could not be created');
		}

		return token;
	},
	generateResetJWT: (userId) => {
		if (!userId) {
			throw new Error('userId is required');
		}

		const payload = { user: { id: userId } };
		const token = jwt.sign(payload, process.env.JWT_RESET_KEY);

		if (!token) {
			throw new Error('token could not be created');
		}

		return token;
	},
	validateAccessJWT: async (token) => {
		let verified = false;
		if (!token) {
			throw new Error('No token provided');
		}

		try {
			let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
			if (decoded) {
				verified = decoded;
			}
		} catch (error) {
			throw error;
		} finally {
			return verified;
		}
	},
	validateRefreshJWT: async (token) => {
		let verified = false;
		if (!token) {
			throw new Error('No token provided');
		}

		let decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY);
		if (decoded) {
			verified = decoded;
		}

		return verified;
	},
	validateResetJWT: async (token) => {
		let verified = false;
		if (!token) {
			throw new Error('No token provided');
		}

		let decoded = jwt.verify(token, process.env.JWT_RESET_KEY);
		if (decoded) {
			verified = decoded;
		}

		return verified;
	},
};
