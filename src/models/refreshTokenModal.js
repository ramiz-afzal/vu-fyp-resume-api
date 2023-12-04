import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const model = {
	saveToken: async (userId, refreshToken) => {
		try {
			const token = await prisma.refreshToken.create({
				data: {
					userId: userId,
					token: refreshToken,
				},
			});
			return token;
		} catch (error) {
			return false;
		}
	},
	deleteToken: async (userId, refreshToken) => {
		try {
			const token = await prisma.refreshToken.findUnique({
				where: {
					userId: userId,
					token: refreshToken,
				},
			});

			if (!token) {
				return false;
			}

			await prisma.refreshToken.delete({ where: { id: token.id } });
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	},
	findToken: async (refreshToken) => {
		try {
			const token = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
			if (token) {
				return true;
			}
			return false;
		} catch (error) {
			console.log(error);
			return false;
		}
	},
};
export default model;
