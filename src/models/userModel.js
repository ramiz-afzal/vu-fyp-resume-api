import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const model = {
	getEntries: async () => {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				createdAt: true,
				updatedAt: true,
				meta: false,
				roles: false,
			},
		});
		return users;
	},
	getEntryBy: async (identifier, searchBy = 'id') => {
		if (!searchBy && !identifier) {
			return false;
		}

		let whereClause = {};

		if (searchBy === 'id') {
			whereClause.id = parseInt(identifier);
		} else if (searchBy === 'email') {
			whereClause.email = identifier;
		} else {
			return false;
		}

		const user = await prisma.user.findUnique({
			where: whereClause,
			select: {
				id: true,
				email: true,
				password: true,
				createdAt: true,
				updatedAt: true,
				meta: true,
				roles: {
					include: {
						role: true,
					},
				},
			},
		});

		if (!user) {
			return false;
		}

		return user;
	},
	updateMeta: async (userId, metaKey, metaValue) => {
		if (!userId || !metaKey || !metaValue) {
			return false;
		}

		const user = model.getEntryBy(userId);
		if (!user) {
			return false;
		}

		const updatedmeta = await prisma.userMeta.upsert({
			where: {
				AND: {
					userId: userId,
					key: metaKey,
				},
			},
			update: {
				value: metaValue,
			},
			create: {
				userId: userId,
				key: metaKey,
				value: metaValue,
			},
		});

		if (!updatedmeta) {
			return false;
		}

		return updatedmeta;
	},
	getMeta: async (userId, metaKey, defaultValue = '') => {
		if (!userId || !metaKey) {
			return false;
		}

		const user = model.getEntryBy(userId);
		if (!user) {
			return false;
		}

		const userMeta = await prisma.userMeta.findFirst({
			where: {
				AND: {
					userId: userId,
					key: metaKey,
				},
			},
		});

		if (!userMeta) {
			return false;
		}

		return userMeta.value || defaultValue;
	},
	updatePassword: async (userId, newPassword) => {
		if (!userId || !newPassword) {
			return false;
		}

		const user = model.getEntryBy(userId);
		if (!user) {
			return false;
		}

		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(newPassword, salt);

		const updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				password: password,
			},
			select: {
				id: true,
				email: true,
				createdAt: true,
				updatedAt: true,
				meta: true,
				roles: {
					include: {
						role: true,
					},
				},
			},
		});

		if (!updatedUser) {
			return false;
		}

		return updatedUser;
	},
	createUser: async (data) => {
		if (!data) {
			return false;
		}

		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(data.password, salt);

		let userMeta = [];
		if (data.firstName) {
			userMeta.push({ key: 'first_name', value: data.firstName });
		}
		if (data.middleName) {
			userMeta.push({ key: 'middle_name', value: data.middleName });
		}
		if (data.lastName) {
			userMeta.push({ key: 'last_name', value: data.lastName });
		}
		if (data.gender) {
			userMeta.push({ key: 'gender', value: data.gender });
		}
		if (data.dob) {
			userMeta.push({ key: 'dob', value: data.dob });
		}

		const user = await prisma.user.create({
			data: {
				email: data.email,
				password: password,
				roles: {
					create: {
						roleId: data.accountType == 'professional' ? 3 : 2,
					},
				},
				meta: {
					create: userMeta,
				},
			},
			select: {
				id: true,
				email: true,
				createdAt: true,
				updatedAt: true,
				meta: true,
				roles: {
					include: {
						role: true,
					},
				},
			},
		});

		if (!user) {
			return false;
		}

		return user;
	},
	updateEntry: async (userId, data) => {
		userId = parseInt(userId);
		if (!userId || !data) {
			return false;
		}

		const user = await model.getEntryBy(userId);
		if (!user) {
			return false;
		}

		let userMeta = [];
		if (data.firstName) {
			userMeta.push({ key: 'first_name', value: data.firstName });
		}
		if (data.middleName) {
			userMeta.push({ key: 'middle_name', value: data.middleName });
		}
		if (data.lastName) {
			userMeta.push({ key: 'last_name', value: data.lastName });
		}
		if (data.gender) {
			userMeta.push({ key: 'gender', value: data.gender });
		}
		if (data.dob) {
			userMeta.push({ key: 'dob', value: data.dob });
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				roles: {
					deleteMany: {},
					create: userRole.map((roleItem) => ({
						roleId: roleItem.roleId,
					})),
				},
				meta: {
					deleteMany: {
						OR: userMeta.map((metaItem) => ({ key: metaItem.key })),
					},
					createMany: {
						data: userMeta.map((metaItem) => ({
							key: metaItem.key,
							value: metaItem.value ? metaItem.value : '',
						})),
					},
				},
			},
			select: {
				id: true,
				email: true,
				createdAt: true,
				updatedAt: true,
				meta: true,
				roles: {
					include: {
						role: true,
					},
				},
			},
		});

		if (!updatedUser) {
			return false;
		}

		return updatedUser;
	},
	deleteEntry: async (userId) => {
		userId = parseInt(userId);
		if (!userId) {
			return false;
		}

		const user = await model.getEntryBy(userId);
		if (!user) {
			return false;
		}

		const deleteMeta = prisma.userMeta.deleteMany({ where: { userId: userId } });
		const deleteEntryRoles = prisma.userRole.deleteMany({ where: { userId: userId } });
		const deleteRefreshToken = prisma.refreshToken.deleteMany({ where: { userId: userId } });
		const deleteResetToken = prisma.resetToken.deleteMany({ where: { userId: userId } });
		const deleteEntry = prisma.user.delete({ where: { id: userId } });

		const result = await prisma.$transaction([deleteMeta, deleteEntryRoles, deleteRefreshToken, deleteResetToken, deleteEntry]);

		if (!result) {
			return false;
		}

		return true;
	},
};
export default model;
