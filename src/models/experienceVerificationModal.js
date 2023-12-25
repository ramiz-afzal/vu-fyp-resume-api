import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const model = {
	selectFields: { id: true, isVerified: true, stillEmployed: true, company: true, designation: true, startDate: true, endDate: true, description: true, createdAt: true, updatedAt: true, resume: { include: { meta: true, employee: { include: { department: true } } } } },
	getEntries: async (companyId, query = null) => {
		if (!companyId) {
			return false;
		}

		companyId = parseInt(companyId);

		let whereClause = { companyId: companyId };

		if ('isVerified' in query && query.isVerified !== null) {
			whereClause.isVerified = query.isVerified.toLowerCase() === 'true';
		}

		const experience = await prisma.experience.findMany({
			where: {
				...whereClause,
			},
			select: { ...model.selectFields, resume: { include: { meta: true } } },
		});
		return experience;
	},
	getEntry: async (companyId, experienceId) => {
		if (!experienceId || !companyId) {
			return false;
		}

		experienceId = parseInt(experienceId);
		companyId = parseInt(companyId);

		const resume = await prisma.experience.findUnique({
			where: {
				id: experienceId,
				companyId: companyId,
			},
			select: { ...model.selectFields },
		});

		if (!resume) {
			return false;
		}

		return resume;
	},
	updateEntry: async (companyId, experienceId) => {
		companyId = parseInt(companyId);
		experienceId = parseInt(experienceId);
		if (!companyId || !experienceId) {
			return false;
		}

		const experience = await model.getEntry(companyId, experienceId);
		if (!experience) {
			return false;
		}

		const updatedExperience = await prisma.experience.update({
			where: {
				id: experienceId,
				companyId: companyId,
			},
			data: {
				isVerified: true,
			},
			select: { ...model.selectFields },
		});

		if (!updatedExperience) {
			return false;
		}

		return updatedExperience;
	},
};
export default model;
