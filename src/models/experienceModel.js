import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const model = {
	selectFields: { id: true, isVerified: true, stillEmployed: true, company: true, designation: true, startDate: true, endDate: true, description: true, createdAt: true, updatedAt: true },
	getEntries: async (resumeId) => {
		if (!resumeId) {
			return false;
		}

		resumeId = parseInt(resumeId);
		const experience = await prisma.experience.findMany({
			where: {
				resumeId: resumeId,
			},
			select: { ...model.selectFields },
		});
		return experience;
	},
	getEntry: async (experienceId, resumeId) => {
		if (!experienceId || !resumeId) {
			return false;
		}

		experienceId = parseInt(experienceId);
		resumeId = parseInt(resumeId);

		const resume = await prisma.experience.findUnique({
			where: {
				id: experienceId,
				resumeId: resumeId,
			},
			select: { ...model.selectFields },
		});

		if (!resume) {
			return false;
		}

		return resume;
	},
	createEntry: async (data) => {
		if (!data || !data.resumeId) {
			return false;
		}

		let resumeId = parseInt(data.resumeId);
		let createBody = {};
		if ('stillEmployed' in data && data.stillEmployed !== null) {
			createBody.stillEmployed = data.stillEmployed;
		}
		if ('companyId' in data && data.companyId !== null) {
			createBody.companyId = parseInt(data.companyId);
		}
		if ('designation' in data && data.designation !== null) {
			createBody.designation = data.designation;
		}
		if ('startDate' in data && data.startDate !== null) {
			let date = new Date(data.startDate);
			createBody.startDate = date;
		}
		if ('endDate' in data && data.endDate !== null) {
			let date = new Date(data.endDate);
			createBody.endDate = date;
		}
		if ('description' in data && data.description !== null) {
			createBody.description = data.description;
		}

		const experience = await prisma.experience.create({
			data: {
				resumeId: resumeId,
				...createBody,
			},
			select: { ...model.selectFields },
		});

		if (!experience) {
			return false;
		}

		return experience;
	},
	updateEntry: async (experienceId, data) => {
		experienceId = parseInt(experienceId);
		let resumeId = parseInt(data.resumeId);
		if (!experienceId || !data || !resumeId) {
			return false;
		}

		const experience = await model.getEntry(experienceId, resumeId);
		if (!experience) {
			return false;
		}

		let updateData = {};
		if ('stillEmployed' in data && data.stillEmployed !== null) {
			updateData.stillEmployed = data.stillEmployed;
		}
		if ('companyId' in data && data.companyId !== null) {
			updateData.companyId = parseInt(data.companyId);
		}
		if ('designation' in data && data.designation !== null) {
			updateData.designation = data.designation;
		}
		if ('startDate' in data && data.startDate !== null) {
			let date = new Date(data.startDate);
			updateData.startDate = date;
		}
		if ('endDate' in data && data.endDate !== null) {
			let date = new Date(data.endDate);
			updateData.endDate = date;
		}
		if ('description' in data && data.description !== null) {
			updateData.description = data.description;
		}

		const updatedExperience = await prisma.experience.update({
			where: { id: experienceId, resumeId: resumeId },
			data: {
				...updateData,
			},
			select: { ...model.selectFields },
		});

		if (!updatedExperience) {
			return false;
		}

		return updatedExperience;
	},
	deleteEntry: async (experienceId, resumeId) => {
		experienceId = parseInt(experienceId);
		resumeId = parseInt(resumeId);
		if (!experienceId || !resumeId) {
			return false;
		}

		const experience = await model.getEntry(experienceId, resumeId);
		if (!experience) {
			return false;
		}

		const result = await prisma.experience.delete({ where: { id: experienceId } });

		if (!result) {
			return false;
		}

		return true;
	},
};
export default model;
