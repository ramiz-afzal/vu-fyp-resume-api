import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const model = {
	selectFields: {
		id: true,
		firstName: true,
		lastName: true,
		designation: true,
		startDate: true,
		endDate: true,
		employee: true,
		createdAt: true,
		updatedAt: true,
	},
	getEntries: async () => {
		const illiterateEmployees = await prisma.illiterateEmployee.findMany({
			select: {
				...model.selectFields,
			},
		});
		return illiterateEmployees;
	},
	getEntry: async (illiterateEmployeeId) => {
		illiterateEmployeeId = parseInt(illiterateEmployeeId);
		if (!illiterateEmployeeId) {
			return false;
		}

		const illiterateEmployee = await prisma.illiterateEmployee.findUnique({
			where: {
				id: illiterateEmployeeId,
			},
			select: {
				...model.selectFields,
			},
		});

		if (!illiterateEmployee) {
			return false;
		}

		return illiterateEmployee;
	},
	createEntry: async (data) => {
		if (!data) {
			return false;
		}

		let createBody = {};
		if ('firstName' in data && data.firstName !== null) {
			createBody.firstName = data.firstName;
		}
		if ('lastName' in data && data.lastName !== null) {
			createBody.lastName = data.lastName;
		}
		if ('designation' in data && data.designation !== null) {
			createBody.designation = data.designation;
		}
		if ('startDate' in data && data.startDate !== null) {
			createBody.startDate = new Date(data.startDate);
		}
		if ('endDate' in data && data.endDate !== null) {
			createBody.endDate = new Date(data.endDate);
		}

		const illiterateEmployee = await prisma.illiterateEmployee.create({
			data: {
				...createBody,
			},
			select: {
				...model.selectFields,
			},
		});

		if (!illiterateEmployee) {
			return false;
		}

		return illiterateEmployee;
	},
	updateEntry: async (illiterateEmployeeId, data) => {
		illiterateEmployeeId = parseInt(illiterateEmployeeId);
		if (!illiterateEmployeeId || !data) {
			return false;
		}

		const illiterateEmployee = await model.getEntry(illiterateEmployeeId);
		if (!illiterateEmployee) {
			return false;
		}

		let updateData = {};
		if ('title' in data && data.title !== null) {
			updateData.title = data.title;
		}
		if ('firstName' in data && data.firstName !== null) {
			updateData.firstName = data.firstName;
		}
		if ('lastName' in data && data.lastName !== null) {
			updateData.lastName = data.lastName;
		}
		if ('designation' in data && data.designation !== null) {
			updateData.designation = data.designation;
		}
		if ('startDate' in data && data.startDate !== null) {
			updateData.startDate = new Date(data.startDate);
		}
		if ('endDate' in data && data.endDate !== null) {
			updateData.endDate = new Date(data.endDate);
		}

		const updatedIlliterateEmployee = await prisma.illiterateEmployee.update({
			where: { id: illiterateEmployeeId },
			data: {
				...updateData,
			},
			select: {
				...model.selectFields,
			},
		});

		if (!updatedIlliterateEmployee) {
			return false;
		}

		return updatedIlliterateEmployee;
	},
	deleteEntry: async (illiterateEmployeeId) => {
		illiterateEmployeeId = parseInt(illiterateEmployeeId);
		if (!illiterateEmployeeId) {
			return false;
		}

		const illiterateEmployee = await model.getEntry(illiterateEmployeeId);
		if (!illiterateEmployee) {
			return false;
		}

		const result = await prisma.illiterateEmployee.delete({ where: { id: illiterateEmployeeId } });

		if (!result) {
			return false;
		}

		return true;
	},
};
export default model;
