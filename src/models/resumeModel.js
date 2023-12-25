import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const model = {
	selectFields: {
		id: true,
		user: true,
		image: true,
		meta: true,
		education: true,
		experience: {
			select: {
				id: true,
				isVerified: true,
				stillEmployed: true,
				company: true,
				designation: true,
				startDate: true,
				endDate: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		},
		certification: true,
		createdAt: true,
		updatedAt: true,
	},
	getEntries: async () => {
		const resumes = await prisma.resume.findMany({
			select: {
				...model.selectFields,
			},
		});
		return resumes;
	},
	getSearchResults: async (query) => {
		if (!query) {
			return false;
		}
		const resumes = await prisma.resume.findMany({
			where: {
				OR: [
					{
						meta: {
							some: {
								value: {
									contains: query,
								},
							},
						},
					},
				],
			},
			select: {
				...model.selectFields,
			},
		});
		return resumes;
	},
	getEntry: async (resumeId) => {
		resumeId = parseInt(resumeId);
		if (!resumeId) {
			return false;
		}

		const resume = await prisma.resume.findUnique({
			where: {
				id: resumeId,
			},
			select: {
				...model.selectFields,
			},
		});

		if (!resume) {
			return false;
		}

		return resume;
	},
	getUserResume: async (userId) => {
		userId = parseInt(userId);
		if (!userId) {
			return false;
		}

		const resume = await prisma.resume.findMany({
			where: {
				userId: userId,
			},
			select: {
				...model.selectFields,
			},
		});

		if (!resume) {
			return false;
		}

		return resume;
	},
	createEntry: async (data) => {
		if (!data || !data.userId) {
			return false;
		}

		let resumeMeta = [];
		if (data.firstName) {
			resumeMeta.push({ key: 'first_name', value: data.firstName });
		}
		if (data.lastName) {
			resumeMeta.push({ key: 'last_name', value: data.lastName });
		}
		if (data.designation) {
			resumeMeta.push({ key: 'designation', value: data.designation });
		}
		if (data.biography) {
			resumeMeta.push({ key: 'biography', value: data.biography });
		}
		if (data.gender) {
			resumeMeta.push({ key: 'gender', value: data.gender });
		}
		if (data.dob) {
			resumeMeta.push({ key: 'dob', value: data.dob });
		}
		if (data.phone) {
			resumeMeta.push({ key: 'phone', value: data.phone });
		}
		if (data.religion) {
			resumeMeta.push({ key: 'religion', value: data.religion });
		}
		if (data.martialStatus) {
			resumeMeta.push({ key: 'martial_status', value: data.martialStatus });
		}
		if (data.address_1) {
			resumeMeta.push({ key: 'address_1', value: data.address_1 });
		}
		if (data.address_2) {
			resumeMeta.push({ key: 'address_2', value: data.address_2 });
		}
		if (data.city) {
			resumeMeta.push({ key: 'city', value: data.city });
		}
		if (data.state) {
			resumeMeta.push({ key: 'state', value: data.state });
		}
		if (data.country) {
			resumeMeta.push({ key: 'country', value: data.country });
		}

		const resume = await prisma.resume.create({
			data: {
				userId: data.userId,
				meta: {
					create: resumeMeta,
				},
			},
			select: {
				...model.selectFields,
			},
		});

		if (!resume) {
			return false;
		}

		return resume;
	},
	updateEntry: async (resumeId, data) => {
		resumeId = parseInt(resumeId);
		if (!resumeId || !data) {
			return false;
		}

		const resume = await model.getEntry(resumeId);
		if (!resume) {
			return false;
		}

		let updateObject = {};
		if (data.imageId) {
			updateObject.imageId = data.imageId;
		}

		let resumeMeta = [];
		if (data.firstName) {
			resumeMeta.push({ key: 'first_name', value: data.firstName });
		}
		if (data.lastName) {
			resumeMeta.push({ key: 'last_name', value: data.lastName });
		}
		if (data.biography) {
			resumeMeta.push({ key: 'biography', value: data.biography });
		}
		if (data.designation) {
			resumeMeta.push({ key: 'designation', value: data.designation });
		}
		if (data.gender) {
			resumeMeta.push({ key: 'gender', value: data.gender });
		}
		if (data.dob) {
			resumeMeta.push({ key: 'dob', value: data.dob });
		}
		if (data.gender) {
			resumeMeta.push({ key: 'gender', value: data.gender });
		}
		if (data.phone) {
			resumeMeta.push({ key: 'phone', value: data.phone });
		}
		if (data.religion) {
			resumeMeta.push({ key: 'religion', value: data.religion });
		}
		if (data.martialStatus) {
			resumeMeta.push({ key: 'martial_status', value: data.martialStatus });
		}
		if (data.address_1) {
			resumeMeta.push({ key: 'address_1', value: data.address_1 });
		}
		if (data.address_2) {
			resumeMeta.push({ key: 'address_2', value: data.address_2 });
		}
		if (data.city) {
			resumeMeta.push({ key: 'city', value: data.city });
		}
		if (data.state) {
			resumeMeta.push({ key: 'state', value: data.state });
		}
		if (data.country) {
			resumeMeta.push({ key: 'country', value: data.country });
		}

		updateObject.meta = {
			deleteMany: {
				OR: resumeMeta.map((metaItem) => ({ key: metaItem.key })),
			},
			createMany: {
				data: resumeMeta.map((metaItem) => ({
					key: metaItem.key,
					value: metaItem.value ? metaItem.value : '',
				})),
			},
		};

		const updatedResume = await prisma.resume.update({
			where: { id: resumeId },
			data: updateObject,
			select: {
				...model.selectFields,
			},
		});

		if (!updatedResume) {
			return false;
		}

		return updatedResume;
	},
	deleteEntry: async (resumeId) => {
		resumeId = parseInt(resumeId);
		if (!resumeId) {
			return false;
		}

		const resume = await model.getEntry(resumeId);
		if (!resume) {
			return false;
		}

		const deleteMeta = prisma.resumeMeta.deleteMany({ where: { resumeId: resumeId } });
		const deleteEducation = prisma.education.deleteMany({ where: { resumeId: resumeId } });
		const deleteExperience = prisma.experience.deleteMany({ where: { resumeId: resumeId } });
		const deleteCertification = prisma.certification.deleteMany({ where: { resumeId: resumeId } });
		const deleteEntry = prisma.resume.delete({ where: { id: resumeId } });

		const result = await prisma.$transaction([deleteMeta, deleteEducation, deleteExperience, deleteCertification, deleteEntry]);

		if (!result) {
			return false;
		}

		return true;
	},
	updateMeta: async (resumeId, metaKey, metaValue) => {
		if (!resumeId || !metaKey || !metaValue) {
			return false;
		}

		const resume = model.getEntry(resumeId);
		if (!resume) {
			return false;
		}

		const updatedMeta = await prisma.resumeMeta.upsert({
			where: {
				AND: {
					resumeId: resumeId,
					key: metaKey,
				},
			},
			update: {
				value: metaValue,
			},
			create: {
				resumeId: resumeId,
				key: metaKey,
				value: metaValue,
			},
		});

		if (!updatedMeta) {
			return false;
		}

		return updatedMeta;
	},
	getMeta: async (resumeId, metaKey, defaultValue = '') => {
		if (!resumeId || !metaKey) {
			return false;
		}

		const resume = model.getEntry(resumeId);
		if (!resume) {
			return false;
		}

		const resumeMeta = await prisma.resumeMeta.findFirst({
			where: {
				AND: {
					resumeId: resumeId,
					key: metaKey,
				},
			},
		});

		if (!resumeMeta) {
			return false;
		}

		return resumeMeta.value || defaultValue;
	},
};
export default model;
