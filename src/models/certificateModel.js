import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const model = {
	getEntries: async (resumeId) => {
		if (!resumeId) {
			return false;
		}

		resumeId = parseInt(resumeId);
		const certification = await prisma.certification.findMany({
			where: {
				resumeId: resumeId,
			},
			select: {
				id: true,
				title: true,
				institute: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		return certification;
	},
	getEntry: async (certificationId, resumeId) => {
		if (!certificationId || !resumeId) {
			return false;
		}

		certificationId = parseInt(certificationId);
		resumeId = parseInt(resumeId);

		const resume = await prisma.certification.findUnique({
			where: {
				id: certificationId,
				resumeId: resumeId,
			},
			select: {
				id: true,
				title: true,
				institute: true,
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
		if ('institute' in data && data.institute !== null) {
			createBody.institute = data.institute;
		}
		if ('title' in data && data.title !== null) {
			createBody.title = data.title;
		}
		if ('description' in data && data.description !== null) {
			createBody.description = data.description;
		}

		const certification = await prisma.certification.create({
			data: {
				resumeId: resumeId,
				...createBody,
			},
			select: {
				id: true,
				title: true,
				institute: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!certification) {
			return false;
		}

		return certification;
	},
	updateEntry: async (certificationId, data) => {
		certificationId = parseInt(certificationId);
		let resumeId = parseInt(data.resumeId);
		if (!certificationId || !data || !resumeId) {
			return false;
		}

		const certification = await model.getEntry(certificationId, resumeId);
		if (!certification) {
			return false;
		}

		let updateData = {};
		if ('institute' in data && data.institute !== null) {
			updateData.institute = data.institute;
		}
		if ('title' in data && data.title !== null) {
			updateData.title = data.title;
		}
		if ('description' in data && data.description !== null) {
			updateData.description = data.description;
		}

		const updatedCertification = await prisma.certification.update({
			where: { id: certificationId, resumeId: resumeId },
			data: {
				...updateData,
			},
			select: {
				id: true,
				title: true,
				institute: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!updatedCertification) {
			return false;
		}

		return updatedCertification;
	},
	deleteEntry: async (certificationId, resumeId) => {
		certificationId = parseInt(certificationId);
		resumeId = parseInt(resumeId);
		if (!certificationId || !resumeId) {
			return false;
		}

		const certification = await model.getEntry(certificationId, resumeId);
		if (!certification) {
			return false;
		}

		const result = await prisma.certification.delete({ where: { id: certificationId } });

		if (!result) {
			return false;
		}

		return true;
	},
};
export default model;
