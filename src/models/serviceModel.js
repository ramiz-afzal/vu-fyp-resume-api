import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const model = {
	getEntries: async (companyId) => {
		if (!companyId) {
			return false;
		}

		companyId = parseInt(companyId);
		const service = await prisma.service.findMany({
			where: {
				companyId: companyId,
			},
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		return service;
	},
	getEntry: async (serviceId, companyId) => {
		if (!serviceId || !companyId) {
			return false;
		}

		serviceId = parseInt(serviceId);
		companyId = parseInt(companyId);

		const service = await prisma.service.findUnique({
			where: {
				id: serviceId,
				companyId: companyId,
			},
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!service) {
			return false;
		}

		return service;
	},
	createEntry: async (data) => {
		if (!data || !data.companyId) {
			return false;
		}

		let companyId = parseInt(data.companyId);
		let createBody = {};
		if ('title' in data && data.title !== null) {
			createBody.title = data.title;
		}
		if ('description' in data && data.description !== null) {
			createBody.description = data.description;
		}

		const service = await prisma.service.create({
			data: {
				companyId: companyId,
				...createBody,
			},
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!service) {
			return false;
		}

		return service;
	},
	updateEntry: async (serviceId, data) => {
		serviceId = parseInt(serviceId);
		let companyId = parseInt(data.companyId);
		if (!serviceId || !data || !companyId) {
			return false;
		}

		const service = await model.getEntry(serviceId, companyId);
		if (!service) {
			return false;
		}

		let updateData = {};
		if ('title' in data && data.title !== null) {
			updateData.title = data.title;
		}
		if ('description' in data && data.description !== null) {
			updateData.description = data.description;
		}

		const updatedService = await prisma.service.update({
			where: { id: serviceId, companyId: companyId },
			data: {
				...updateData,
			},
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!updatedService) {
			return false;
		}

		return updatedService;
	},
	deleteEntry: async (serviceId, companyId) => {
		serviceId = parseInt(serviceId);
		companyId = parseInt(companyId);
		if (!serviceId || !companyId) {
			return false;
		}

		const service = await model.getEntry(serviceId, companyId);
		if (!service) {
			return false;
		}

		const deleteEntry = prisma.service.delete({ where: { id: serviceId } });

		const result = await prisma.$transaction([deleteEntry]);

		if (!result) {
			return false;
		}

		return true;
	},
};
export default model;
