import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import fileHelpers from '../utils/fileHelpers.js';
import fs from 'fs';
const prisma = new PrismaClient();
const model = {
	selectFields: {
		id: true,
		path: true,
		name: true,
		createdAt: true,
		updatedAt: true,
	},
	getEntry: async (fileId) => {
		if (!fileId) {
			return false;
		}

		fileId = parseInt(fileId);

		const file = await prisma.file.findUnique({
			where: {
				id: fileId,
			},
			select: { ...model.selectFields },
		});

		if (!file) {
			return false;
		}

		return file;
	},
	createEntry: async (file) => {
		if (!file || !file.buffer) {
			return false;
		}

		const rootDir = fileHelpers.getRootDir();
		const filesDir = fileHelpers.getFilesDir();
		const fileName = `${uuidv4()}-${file.originalname}`;
		const filePath = `${filesDir}/${fileName}`;
		const fullPath = `${rootDir}/${filePath}`;

		fs.writeFileSync(fullPath, file.buffer);

		const createdFile = await prisma.file.create({
			data: {
				path: filePath,
				name: fileName,
			},
			select: { ...model.selectFields },
		});

		if (!createdFile) {
			return false;
		}

		return createdFile;
	},
	deleteEntry: async (fileId) => {
		fileId = parseInt(fileId);
		if (!fileId) {
			return false;
		}

		const file = await model.getEntry(fileId);
		if (!file) {
			return false;
		}

		const rootDir = fileHelpers.getRootDir();
		const fullPath = `${rootDir}/${file.path}`;

		fs.unlinkSync(fullPath);

		const deleteEntry = prisma.file.delete({ where: { id: fileId } });

		const result = await prisma.$transaction([deleteEntry]);

		if (!result) {
			return false;
		}
		return true;
	},
};
export default model;
