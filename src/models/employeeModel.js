import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const model = {
	selectFields: {
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
	getEntries: async (departmentId) => {
		if (!departmentId) {
			return false;
		}

		departmentId = parseInt(departmentId);
		const employee = await prisma.employee.findMany({
			where: {
				departmentId: departmentId,
			},
			select: { ...model.selectFields },
		});
		return employee;
	},
	getEntry: async (employeeId, departmentId) => {
		if (!employeeId || !departmentId) {
			return false;
		}

		employeeId = parseInt(employeeId);
		departmentId = parseInt(departmentId);

		const employee = await prisma.employee.findUnique({
			where: {
				id: employeeId,
				departmentId: departmentId,
			},
			select: { ...model.selectFields },
		});

		if (!employee) {
			return false;
		}

		return employee;
	},
	createEntry: async (data) => {
		if (!data || !data.departmentId) {
			return false;
		}

		let departmentId = parseInt(data.departmentId);
		let createBody = {};
		if ('type' in data && data.type !== null) {
			createBody.type = data.type;
		}
		if ('employmentType' in data && data.employmentType !== null) {
			createBody.employmentType = data.employmentType;
		}
		if ('employmentPosition' in data && data.employmentPosition !== null) {
			createBody.employmentPosition = data.employmentPosition;
		}
		if ('resumeId' in data && data.resumeId !== null) {
			createBody.resumeId = parseInt(data.resumeId);
		}
		if ('illiterateEmployeeId' in data && data.illiterateEmployeeId !== null) {
			createBody.illiterateEmployeeId = parseInt(data.illiterateEmployeeId);
		}

		const employee = await prisma.employee.create({
			data: {
				departmentId: departmentId,
				...createBody,
			},
			select: { ...model.selectFields },
		});

		if (!employee) {
			return false;
		}

		return employee;
	},
	updateEntry: async (employeeId, data) => {
		employeeId = parseInt(employeeId);
		let departmentId = parseInt(data.departmentId);
		if (!employeeId || !data || !departmentId) {
			return false;
		}

		const employee = await model.getEntry(employeeId, departmentId);
		if (!employee) {
			return false;
		}

		let updateData = {};
		if ('type' in data && data.type !== null) {
			updateData.type = data.type;
		}
		if ('resumeId' in data && data.resumeId !== null) {
			updateData.resumeId = data.resumeId;
		}
		if ('employmentType' in data && data.employmentType !== null) {
			updateData.employmentType = data.employmentType;
		}
		if ('employmentPosition' in data && data.employmentPosition !== null) {
			updateData.employmentPosition = data.employmentPosition;
		}
		if ('illiterateEmployeeId' in data && data.illiterateEmployeeId !== null) {
			updateData.illiterateEmployeeId = data.illiterateEmployeeId;
		}

		const updatedEmployee = await prisma.employee.update({
			where: { id: employeeId, departmentId: departmentId },
			data: {
				...updateData,
			},
			select: { ...model.selectFields },
		});

		if (!updatedEmployee) {
			return false;
		}

		return updatedEmployee;
	},
	deleteEntry: async (employeeId, departmentId) => {
		employeeId = parseInt(employeeId);
		departmentId = parseInt(departmentId);
		if (!employeeId || !departmentId) {
			return false;
		}

		const employee = await model.getEntry(employeeId, departmentId);
		if (!employee) {
			return false;
		}

		if (employee.type == 'illiterate' && employee.illiterateEmployee !== null) {
			await prisma.illiterateEmployee.delete({ where: { id: employee.illiterateEmployee.id } });
		}

		const result = await prisma.employee.delete({ where: { id: employeeId } });

		if (!result) {
			return false;
		}

		return true;
	},
	entryExists: async (data) => {
		if (!data) {
			throw new Error('entryExists requires request data');
		}

		let createBody = {};
		if ('type' in data && data.type !== null) {
			createBody.type = data.type;
		}
		if ('resumeId' in data && data.resumeId !== null) {
			createBody.resumeId = parseInt(data.resumeId);
		}
		if ('illiterateEmployeeId' in data && data.illiterateEmployeeId !== null) {
			createBody.illiterateEmployeeId = parseInt(data.illiterateEmployeeId);
		}

		let searchQuery = {};
		if (createBody.type == 'educated') {
			searchQuery = { resumeId: createBody.resumeId };
		} else if (createBody.type == 'illiterate') {
			searchQuery = { illiterateEmployeeId: createBody.illiterateEmployeeId };
		}

		const employeeExists = await prisma.employee.findUnique({
			where: {
				...searchQuery,
			},
			select: { ...model.selectFields },
		});
		return employeeExists;
	},
};
export default model;
