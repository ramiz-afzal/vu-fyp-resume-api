import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const model = {
	getEntries: async (companyId) => {
		if (!companyId) {
			return false;
		}

		companyId = parseInt(companyId);
		const department = await prisma.department.findMany({
			where: {
				companyId: companyId,
			},
			select: {
				id: true,
				title: true,
				description: true,
				employee: {
					select: {
						id: true,
						type: true,
						employmentType: true,
						employmentPosition: true,
						resume: {
							select: {
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
						},
						illiterateEmployee: true,
						department: true,
						createdAt: true,
						updatedAt: true,
					},
				},
				createdAt: true,
				updatedAt: true,
			},
		});
		return department;
	},
	getEntry: async (departmentId, companyId) => {
		if (!departmentId || !companyId) {
			return false;
		}

		departmentId = parseInt(departmentId);
		companyId = parseInt(companyId);

		const department = await prisma.department.findUnique({
			where: {
				id: departmentId,
				companyId: companyId,
			},
			select: {
				id: true,
				title: true,
				description: true,
				employee: {
					select: {
						id: true,
						type: true,
						employmentType: true,
						employmentPosition: true,
						resume: {
							select: {
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
						},
						illiterateEmployee: true,
						department: true,
						createdAt: true,
						updatedAt: true,
					},
				},
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!department) {
			return false;
		}

		return department;
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

		const department = await prisma.department.create({
			data: {
				companyId: companyId,
				...createBody,
			},
			select: {
				id: true,
				title: true,
				description: true,
				employee: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!department) {
			return false;
		}

		return department;
	},
	updateEntry: async (departmentId, data) => {
		departmentId = parseInt(departmentId);
		let companyId = parseInt(data.companyId);
		if (!departmentId || !data || !companyId) {
			return false;
		}

		const department = await model.getEntry(departmentId, companyId);
		if (!department) {
			return false;
		}

		let updateData = {};
		if ('title' in data && data.title !== null) {
			updateData.title = data.title;
		}
		if ('description' in data && data.description !== null) {
			updateData.description = data.description;
		}

		const updatedDepartment = await prisma.department.update({
			where: { id: departmentId, companyId: companyId },
			data: {
				...updateData,
			},
			select: {
				id: true,
				title: true,
				description: true,
				employee: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!updatedDepartment) {
			return false;
		}

		return updatedDepartment;
	},
	deleteEntry: async (departmentId, companyId) => {
		departmentId = parseInt(departmentId);
		companyId = parseInt(companyId);
		if (!departmentId || !companyId) {
			return false;
		}

		const department = await model.getEntry(departmentId, companyId);
		if (!department) {
			return false;
		}

		const deleteEmployees = prisma.employee.deleteMany({ where: { departmentId: departmentId } });
		const deleteEntry = prisma.department.delete({ where: { id: departmentId } });

		const result = await prisma.$transaction([deleteEmployees, deleteEntry]);

		if (!result) {
			return false;
		}

		return true;
	},
};
export default model;
