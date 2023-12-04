import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModel from '../models/userModel.js';
dotenv.config();
export default (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		if (!authHeader) {
			return res.status(401).send({ message: 'Unauthorized' });
		}

		const headerParts = authHeader.split(' ');
		const token = headerParts[1];

		if (!token) {
			return res.status(401).send({ message: 'Unauthorized' });
		}

		jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
			if (err) {
				return res.status(403).send({ message: 'Unauthorized' });
			}

			const userId = payload?.user?.id;
			if (!userId) {
				res.status(403).send({ message: 'Unauthorized' });
				return;
			}

			const user = await UserModel.getEntryBy(userId);
			if (!user) {
				res.status(403).send({ message: 'Unauthorized' });
				return;
			}

			req.user = user;
			next();
		});
	} catch (error) {
		return res.status(500).send({ message: 'Something went wrong' });
	}
};
