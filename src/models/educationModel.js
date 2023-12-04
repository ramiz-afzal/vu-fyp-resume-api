import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const model = {
	getEntries: async (resumeId) => {
		if (!resumeId) {
			return false;
		}

		resumeId = parseInt(resumeId);
		const education = await prisma.education.findMany({
			where: {
				resumeId: resumeId,
			},
			select: {
				id: true,
				inProcess: true,
				institute: true,
				degree: true,
				startDate: true,
				endDate: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		return education;
	},
	getEntry: async (educationId, resumeId) => {
		if (!educationId || !resumeId) {
			return false;
		}

		educationId = parseInt(educationId);
		resumeId = parseInt(resumeId);

		const resume = await prisma.education.findUnique({
			where: {
				id: educationId,
				resumeId: resumeId,
			},
			select: {
				id: true,
				inProcess: true,
				institute: true,
				degree: true,
				startDate: true,
				endDate: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
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
		if ('inProcess' in data && data.inProcess !== null) {
			createBody.inProcess = data.inProcess;
		}
		if ('institute' in data && data.institute !== null) {
			createBody.institute = data.institute;
		}
		if ('degree' in data && data.degree !== null) {
			createBody.degree = data.degree;
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

		const education = await prisma.education.create({
			data: {
				resumeId: resumeId,
				...createBody,
			},
			select: {
				id: true,
				inProcess: true,
				institute: true,
				degree: true,
				startDate: true,
				endDate: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!education) {
			return false;
		}

		return education;
	},
	updateEntry: async (educationId, data) => {
		educationId = parseInt(educationId);
		let resumeId = parseInt(data.resumeId);
		if (!educationId || !data || !resumeId) {
			return false;
		}

		const education = await model.getEntry(educationId, resumeId);
		if (!education) {
			return false;
		}

		let updateData = {};
		if ('inProcess' in data && data.inProcess !== null) {
			updateData.inProcess = data.inProcess;
		}
		if ('institute' in data && data.institute !== null) {
			updateData.institute = data.institute;
		}
		if ('degree' in data && data.degree !== null) {
			updateData.degree = data.degree;
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

		const updatedEducation = await prisma.education.update({
			where: { id: educationId, resumeId: resumeId },
			data: {
				...updateData,
			},
			select: {
				id: true,
				inProcess: true,
				institute: true,
				degree: true,
				startDate: true,
				endDate: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!updatedEducation) {
			return false;
		}

		return updatedEducation;
	},
	deleteEntry: async (educationId, resumeId) => {
		educationId = parseInt(educationId);
		resumeId = parseInt(resumeId);
		if (!educationId || !resumeId) {
			return false;
		}

		const education = await model.getEntry(educationId, resumeId);
		if (!education) {
			return false;
		}

		const result = await prisma.education.delete({ where: { id: educationId } });

		if (!result) {
			return false;
		}

		return true;
	},
};
export default model;
