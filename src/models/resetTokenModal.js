import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const model = {
	saveToken: async (userId, resetToken) => {
		try {
			const token = await prisma.resetToken.create({
				data: {
					userId: userId,
					token: resetToken,
				},
			});
			return token;
		} catch (error) {
			console.log(error);
			return false;
		}
	},
	deleteToken: async (userId, resetToken) => {
		try {
			const token = await prisma.resetToken.findUnique({
				where: {
					userId: userId,
					token: resetToken,
				},
			});

			if (!token) {
				return false;
			}

			await prisma.resetToken.delete({ where: { id: token.id } });
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	},
	findToken: async (resetToken) => {
		try {
			const token = await prisma.resetToken.findUnique({ where: { token: resetToken } });
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
