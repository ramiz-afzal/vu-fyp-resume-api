import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const model = {
	getEntries: async () => {
		const resumes = await prisma.company.findMany({
			select: {
				id: true,
				title: true,
				description: true,
				services: true,
				departments: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		return resumes;
	},
	getEntry: async (companyId) => {
		companyId = parseInt(companyId);
		if (!companyId) {
			return false;
		}

		const company = await prisma.company.findUnique({
			where: {
				id: companyId,
			},
			select: {
				id: true,
				title: true,
				description: true,
				services: true,
				departments: {
					select: {
						id: true,
						title: true,
						description: true,
						employee: {
							select: {
								id: true,
								type: true,
								user: {
									select: {
										id: true,
										email: true,
										meta: true,
									},
								},
								illiterateEmployee: true,
								createdAt: true,
								updatedAt: true,
							},
						},
						createdAt: true,
						updatedAt: true,
					},
				},
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!company) {
			return false;
		}

		return company;
	},
	createEntry: async (data) => {
		if (!data || !data.userId) {
			return false;
		}

		let createBody = {};
		if ('title' in data && data.title !== null) {
			createBody.title = data.title;
		}
		if ('description' in data && data.description !== null) {
			createBody.description = data.description;
		}

		const company = await prisma.company.create({
			data: {
				userId: data.userId,
				...createBody,
			},
			select: {
				id: true,
				title: true,
				description: true,
				services: true,
				departments: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!company) {
			return false;
		}

		return company;
	},
	updateEntry: async (companyId, data) => {
		companyId = parseInt(companyId);
		if (!companyId || !data) {
			return false;
		}

		const company = await model.getEntry(companyId);
		if (!company) {
			return false;
		}

		let updateData = {};
		if ('title' in data && data.title !== null) {
			updateData.title = data.title;
		}
		if ('description' in data && data.description !== null) {
			updateData.description = data.description;
		}

		const updatedCompany = await prisma.company.update({
			where: { id: companyId },
			data: {
				...updateData,
			},
			select: {
				id: true,
				title: true,
				description: true,
				services: true,
				departments: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!updatedCompany) {
			return false;
		}

		return updatedCompany;
	},
	deleteEntry: async (companyId) => {
		companyId = parseInt(companyId);
		if (!companyId) {
			return false;
		}

		const company = await model.getEntry(companyId);
		if (!company) {
			return false;
		}

		const deleteIlliterateEmployee = prisma.illiterateEmployee.deleteMany({
			where: {
				employee: {
					department: {
						companyId: companyId,
					},
				},
			},
		});
		const deleteEmployee = prisma.employee.deleteMany({
			where: {
				department: {
					companyId: companyId,
				},
			},
		});
		const deleteDepartment = prisma.department.deleteMany({ where: { companyId: companyId } });
		const deleteService = prisma.service.deleteMany({ where: { companyId: companyId } });
		const deleteEntry = prisma.company.delete({ where: { id: companyId } });

		const result = await prisma.$transaction([deleteIlliterateEmployee, deleteEmployee, deleteDepartment, deleteService, deleteEntry]);

		if (!result) {
			return false;
		}

		return true;
	},
};
export default model;
